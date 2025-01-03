import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { AppConfigService } from '../../config/config.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), JwtModule, AuthModule],
  controllers: [NoteController],
  providers: [NoteService, AuthGuard, AppConfigService]
})
export class NoteModule {}
