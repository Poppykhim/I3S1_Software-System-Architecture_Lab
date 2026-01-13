import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, RolePermission, RefreshToken]),
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
