import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Schema } from './config/env-schema';
import { MyLogger } from './shared/logger.service';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService: ConfigService<Schema> = app.get(ConfigService);
  const port = configService.get('PORT');
  const apiPrefix = configService.get('API_PREFIX');

  // logging middleware
  const logger = new MyLogger();
  app.useLogger(logger);

  app.use(
    morgan('short', {
      stream: {
        write(data: string) {
          logger.log(data);
        },
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(apiPrefix, app, document);

  await app.listen(port);
  // logger.log(`Swagger is running on http://localhost:${port}/api`);

  return app;
}
const app = bootstrap();

export default app;
