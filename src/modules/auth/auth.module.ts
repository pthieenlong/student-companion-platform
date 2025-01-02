import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../../config/config.service';
import User from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../mail/mail.service';
import { OtpEntity } from '../otp/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OtpEntity]),
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_TOKEN,
      signOptions: { expiresIn: '1h'}
    })
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, AppConfigService, OtpService, MailService]
})
export class AuthModule {}
