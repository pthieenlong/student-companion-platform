import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
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

  get emailHost(): string {
    return this.configService.get<string>('EMAIL_HOST');
  }

  get emailPort(): number {
    return this.configService.get<number>('EMAIL_PORT');
  }

  get emailUsername(): string {
    return this.configService.get<string>('EMAIL_USERNAME');
  }

  get emailPassword(): string {
    return this.configService.get<string>('EMAIL_PASSWORD');
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

  get uploadDirectory() : string {
    return this.configService.get<string>('FILE_DIRECTORY');
  }

  get fileMaxSize(): number {
    return this.configService.get<number>('FILE_MAX_SIZE'); //15000 = 15kb
  }

  get uploadAllowedMIME(): string {
    return this.configService.get<string>('FILE_ALLOWED_MIME')
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }
  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }
  get redisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }
}
