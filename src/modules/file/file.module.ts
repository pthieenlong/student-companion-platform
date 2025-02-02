import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from './entities/file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AppConfigService } from '../../config/config.service';
import { AppConfigModule } from '../../config/config.module';
import { FILE_PATH } from '../../shared/constants/const';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      useFactory: async () => {
        if(!existsSync(FILE_PATH)) {
          console.log('make dir');
          mkdirSync(FILE_PATH, { recursive: true })
        }

        return {
          storage: diskStorage({
            destination: (req, file, callback) => {
              callback(null, FILE_PATH);
            },
            filename: (req, file, callback) => {
              const uniqueSuffix = `${Date.now()}-${file.originalname}`;
              callback(null, uniqueSuffix);
            }
          })
        }
      }
      // imports: [AppConfigModule],
      // inject: [AppConfigService],
      // useFactory: async (configService: AppConfigService) => {
      //   return {
      //     storage: diskStorage({
      //       destination: FILE_PATH,
      //       filename: (req, file, callback) => {
      //         const filename = `${Date.now()}-${file.originalname}`;
      //         callback(null, filename);
      //       },
      //     }),
      //   };
      // },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
