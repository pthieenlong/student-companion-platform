import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { AppConfigService } from 'src/config/config.service';
import Redis from 'ioredis';
import { AppConfigModule } from 'src/config/config.module';
@Module({
  imports: [AppConfigModule],
  providers: [{
    provide: 'REDIS_CLIENT',
    useFactory: (appConfigService: AppConfigService) => {
      return new Redis({
        host: appConfigService.redisHost,
        port: appConfigService.redisPort,
        password: appConfigService.redisPassword,
      });
    },
    inject: [AppConfigService],
  }, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
