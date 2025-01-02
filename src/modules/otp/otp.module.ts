import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpEntity } from './entities/otp.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity]), AuthModule,JwtModule],
  exports: [OtpService],
  providers: [OtpService]
})
export class OtpModule {}
