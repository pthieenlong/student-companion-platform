import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../../config/config.service';
import User from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_TOKEN,
      signOptions: { expiresIn: '1h'}
    })
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, AppConfigService]
})
export class AuthModule {}
