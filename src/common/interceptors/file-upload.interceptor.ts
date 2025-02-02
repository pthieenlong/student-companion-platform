import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { from, Observable } from 'rxjs';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly multerInterceptor: NestInterceptor;

  constructor(private readonly appConfigService: AppConfigService) {
    this.multerInterceptor = new (FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = this.appConfigService.uploadDirectory;
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          console.log('aasdasd');
          
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: this.appConfigService.fileMaxSize,
      },
      fileFilter: (req, file, callback) => {
        const allowMimes = this.appConfigService.uploadAllowedMIME.split(',');
        if (!allowMimes.includes(file.mimetype)) {
          return callback(new Error('File type not allowed!'), false);
        }
        callback(null, true);
      },
    }))();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const a = from(
      Promise.resolve(this.multerInterceptor.intercept(context, next)) as Promise<Observable<any>>
    );
    console.log(a);
    
    return a;
  }
}
