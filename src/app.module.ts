import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import schema, { Schema } from './config/env-schema';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { FilesModule } from './files/files.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './http-exception.filter';
import validationPipe from './validation.pipe';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: schema,
      validationOptions: {
        abortEarly: false,
        cache: false,
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Schema>) => {
        const user = configService.get<Schema['DB_USER']>('DB_USER');
        const password = configService.get<Schema['DB_PWD']>('DB_PWD');
        const host = configService.get<Schema['DB_HOST']>('DB_HOST');
        const port = configService.get<Schema['DB_PORT']>('DB_PORT');
        const dbName = configService.get<Schema['DB_NAME']>('DB_NAME');
        const uri = `mongodb://${user}:${password}@${host}:${port}`;
        return {
          uri,
          dbName,
        };
      },
    }),
    FilesModule,
    UsersModule,
    PostsModule,
    SharedModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
