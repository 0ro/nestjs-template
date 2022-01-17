import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Schema } from './config/env-schema';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<Schema>) {}

  getHello(): string {
    return 'Hello World!';
  }
}
