import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../config/config.service';
import { AppConfigModule } from '../config/config.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUser,
        password: configService.databasePassword,
        database: configService.databaseName,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.databaseSynchronize,
      })
    }),
  ],
})
export class DatabaseModule {}
