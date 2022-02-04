import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Schema } from 'src/config/env-schema';
import { MyLogger } from './logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  constructor(
    private configService: ConfigService<Schema>,
    private logger: MyLogger,
  ) {
    const s3Config = this.configService.get<Schema['AWS']>('AWS');

    if (s3Config) {
      this.s3Configuration = s3Config;

      this.s3 = new S3({
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
        region: s3Config.region,
      });
      this.logger.log(
        `S3Service was initialized: ${JSON.stringify(s3Config)}`,
        'S3Service',
      );
    } else {
      throw new Error('S3 configuration is missing');
    }
  }
  s3: S3;
  s3Configuration: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };

  async upload(fileName: string, body: Express.Multer.File) {
    const bucket = this.s3Configuration.bucket;

    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: `${uuidv4()}-${fileName}`,
      Body: body.buffer,
      ACL: 'private',
      CacheControl: 'max-age=31536000',
    };

    const uploadedFile = await this.s3.upload(params).promise();

    this.logger.log(`File uploaded: ${JSON.stringify(uploadedFile)}`);

    return uploadedFile;
  }

  read(key: string) {
    const bucket = this.s3Configuration.bucket;

    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 604800, // 1 week
    };

    const url = this.s3.getSignedUrl('getObject', params);

    this.logger.log(`File url: ${url}`);

    return url;
  }
}
