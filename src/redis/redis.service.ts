import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,
  ) {}
  
  async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
    if (expirationInSeconds) {
      await this.redisClient.set(key, value, 'EX', expirationInSeconds);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
