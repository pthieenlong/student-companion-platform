import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { AppConfigService } from '../../config/config.service';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { UserValidationPipe } from '../../common/pipes/user-validation/user-validation.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule,JwtModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, AuthGuard, AppConfigService, RoleGuard, UserValidationPipe],
})
export class UserModule {}
