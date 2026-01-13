import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Repository, In } from 'typeorm';
import { User } from 'src/entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoles: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePerms: Repository<RolePermission>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.users.findOne({ where: { email } });
    if (existingUser) throw new UnauthorizedException('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.users.create({ email, passwordHash });
    const savedUser = await this.users.save(user);

    // Attach default role (assuming ID 1 is 'user')
    const defaultRole = this.userRoles.create({
      user: savedUser,
      role: { id: 1 } as any,
    });
    await this.userRoles.save(defaultRole);

    return { message: 'registered', userId: savedUser.id };
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch roles
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: { role: true },
    });
    const roleNames = roles.map((r) => r.role.name);
    const roleIds = roles.map((r) => r.role.id);

    // Fetch permissions
    const perms = await this.rolePerms.find({
      where: { role: { id: In(roleIds) } },
      relations: { permission: true },
    });
    const permissionKeys = [...new Set(perms.map((p) => p.permission.key))];

    // Generate tokens
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );

    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokens.save(
      this.refreshTokens.create({
        tokenHash: await bcrypt.hash(refreshToken, 10),
        user,
        expiresAt,
      }),
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    // Verify token exists in DB
    const storedTokens = await this.refreshTokens.find({
      relations: { user: true },
    });
    // Compare against hashed tokens
    let matched: RefreshToken | null = null;
    for (const rt of storedTokens) {
      const valid = await bcrypt.compare(refreshToken, rt.tokenHash);
      if (valid && !rt.revokedAt && rt.expiresAt > new Date()) {
        matched = rt;
        break;
      }
    }
    if (!matched) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const user = matched.user;

    // Fetch roles and permissions again
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: { role: true },
    });
    const roleNames = roles.map((r) => r.role.name);
    const roleIds = roles.map((r) => r.role.id);
    const perms = await this.rolePerms.find({
      where: { role: { id: In(roleIds) } },
      relations: { permission: true },
    });
    const permissionKeys = [...new Set(perms.map((p) => p.permission.key))];

    // Issue new access token
    const newAccessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );
    return { accessToken: newAccessToken };
  }
}
