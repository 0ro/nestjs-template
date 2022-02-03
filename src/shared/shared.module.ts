import { Global, Module } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { S3Service } from './s3.service';

@Global()
@Module({
  providers: [S3Service, MyLogger],
  exports: [S3Service, MyLogger],
})
export class SharedModule {}
