// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

// Import ALL related entities
import { User } from '../entities/User.entity';
import { UserRole } from '../entities/user-role.entity';
import { Role } from '../entities/role.entity'; // Found in src/entities
import { Permission } from '../entities/permission.entity'; // Found in src/entities
import { RolePermission } from '../entities/role-permission.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    // Add ALL these to the feature registration
    TypeOrmModule.forFeature([
      User,
      UserRole,
      Role,
      Permission,
      RolePermission,
      RefreshToken,
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
