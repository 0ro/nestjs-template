import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';
import { Schema } from './config/env-schema';
import { MyLogger } from './shared/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService: ConfigService<Schema> = app.get(ConfigService);
  const port = configService.get('PORT');
  const apiPrefix = configService.get('API_PREFIX');
  const sessionSecret = configService.get('SESSION_SECRET');

  // logging middleware
  const logger = new MyLogger();
  app.useLogger(logger);

  // helmet middleware
  app.use(helmet());

  app.use(
    morgan('tiny', {
      stream: {
        write(data: string) {
          logger.log(data.replace(/\n$/, ''), 'Morgan');
        },
      },
    }),
  );

  app.use(cookieParser());

  app.use(
    session({
      // TODO: add redis session store
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Swagger
  const config = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(apiPrefix, app, document);

  await app.listen(port);
  logger.log(`Swagger is running on http://localhost:${port}/api`, 'Swagger');

  return app;
}

export default bootstrap();
