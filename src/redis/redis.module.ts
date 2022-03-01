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
        const host = configService.get<Schema['REDIS_HOST']>('REDIS_HOST');
        const port = configService.get<Schema['REDIS_PORT']>('REDIS_PORT');

        return host && port
          ? Redis.createClient({
              url: `redis://${host}:${port}`,
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
