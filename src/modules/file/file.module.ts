import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../../config/config.service';
import FileEntity from './entities/file.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, AppConfigService],
  exports: [FileService]
})
export class FileModule {}
