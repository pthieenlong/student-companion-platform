import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { AppConfigService } from '../../config/config.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import User from '../user/entities/user.entity';
import React from '../react/entities/react.entity';
import { TagService } from '../tag/tag.service';
import Tag from '../tag/entities/tag.entity';
import FileEntity from '../file/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, User, React, Tag, FileEntity]), JwtModule, AuthModule],
  controllers: [NoteController],
  providers: [NoteService, AuthGuard, AppConfigService, TagService]
})
export class NoteModule {}
