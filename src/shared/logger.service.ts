import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';

export class MyLogger implements LoggerService {
  constructor() {
    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'YY-MM-DD HH:mm:ss',
            }),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }
  private readonly logger: winston.Logger;
  log(message: unknown) {
    this.logger.log('info', message);
  }
  warn(message: unknown) {
    this.logger.log('warn', message);
  }
  error(message: unknown) {
    this.logger.log('error', message);
  }
}
