import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import Tag from './entities/tag.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { UserValidationPipe } from '../../common/pipes/user-validation/user-validation.pipe';
import { AppConfigService } from '../../config/config.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule,JwtModule],
  exports: [TagService],
  controllers: [TagController],
  providers: [TagService, AuthGuard, AppConfigService, RoleGuard, UserValidationPipe],

})
export class TagModule {}
