import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import schema, { Schema } from './config/env-schema';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { FilesModule } from './files/files.module';
import { SharedModule } from './shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';

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
        return {
          uri: configService.get('DB_URL'),
          dbName: configService.get('DB_NAME'),
        };
      },
    }),
    FilesModule,
    UsersModule,
    PostsModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
