import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT');
  }
  get databaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  get databasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  get databaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  get databasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  get databaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }
  
  get databaseSynchronize(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
  }

  get refreshToken(): string {
    return this.configService.get<string>('SECRET_REFRESH_TOKEN');
  
  }
  get accessToken(): string {
    return this.configService.get<string>('SECRET_ACCESS_TOKEN');
  }
  get swaggerTitle(): string {
    return this.configService.get<string>('SWAGGER_TITLE');
  }
  get swaggerDescription(): string {
    return this.configService.get<string>('SWAGGER_DESCRIPTION');
  }
  get swaggerPath(): string {
    return this.configService.get<string>('SWAGGER_PATH');
  }
  get swaggerVersion(): string {
    return this.configService.get<string>('SWAGGER_VERSION');
  }
}
