import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: unknown, stack?: string, context?: string) {
    // add your tailored logic here
    super.error(message, stack, context);
  }
}
