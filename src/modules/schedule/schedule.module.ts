import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import User from '../user/entities/user.entity';
import { FileService } from '../file/file.service';
import FileEntity from '../file/entities/file.entity';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { AppConfigService } from 'src/config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, User, FileEntity]), AuthModule, JwtModule], 
  exports: [ScheduleService],
  controllers: [ScheduleController],
  providers: [ScheduleService, UserService, FileService, AuthGuard, AppConfigService]
})
export class ScheduleModule {}
