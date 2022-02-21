import { Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';

import { Schema } from 'src/config/env-schema';
import { MyLogger } from 'src/shared/logger.service';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async (configService: ConfigService<Schema>) => {
        const redisConfig = configService.get<Schema['REDIS']>('REDIS');
        return redisConfig
          ? Redis.createClient({
              url: `redis://${redisConfig.host}:${redisConfig.port}`,
            })
          : null;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {
  constructor(
    @Inject(REDIS) private readonly redis: Redis.RedisClient,
    private readonly logger: MyLogger,
  ) {
    this.redis.on('error', (err) => {
      this.logger.error('Redis error: ', err, 'Redis');
    });
    this.redis.on('connect', () => {
      this.logger.log('Redis successfully connected', 'Redis');
    });
  }
}
