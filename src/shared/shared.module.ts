import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { Schema } from 'src/config/env-schema';
import { MyLogger } from './logger.service';
import { S3Service } from './s3.service';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Schema>) => {
        return {
          limits: {
            fileSize: configService.get<Schema['MULTER']>('MULTER')?.fileSize,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [S3Service, MyLogger],
  exports: [S3Service, MyLogger, MulterModule],
})
export class SharedModule {}
