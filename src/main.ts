import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectRedis from 'connect-redis';
import * as csurf from 'csurf';
import { Request, Response } from 'express';

import { AppModule } from './app.module';
import { Schema, NodeEnv } from './config/env-schema';
import { MyLogger } from './shared/logger.service';
import { REDIS } from './redis/redis.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService: ConfigService<Schema> = app.get(ConfigService);
  const env = configService.get<Schema['NODE_ENV']>('NODE_ENV');
  const port = configService.get('PORT');
  const apiPrefix = configService.get('API_PREFIX');
  const sessionSecret = configService.get('SESSION_SECRET');
  const RedisStore = connectRedis(session);

  app.enableCors({
    origin: process.env.WEB_APPLICATION_URL || '*',
    credentials: true,
  });

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
      store: new RedisStore({
        client: app.get(REDIS),
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env === NodeEnv.Production ? true : false,
      },
    }),
  );

  // csrf protection
  app.use(
    csurf({
      cookie: true,
    }),
  );

  app.use('*', function (req: Request, res: Response, next: () => void) {
    const CSRF_TOKEN_HEADER = 'X-CSRF-TOKEN';
    if (!req.cookies[CSRF_TOKEN_HEADER]) {
      res.cookie(CSRF_TOKEN_HEADER, req.csrfToken());
    }
    next();
  });

  // passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Swagger
  const config = new DocumentBuilder().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(apiPrefix, app, document, {
    swaggerOptions: {
      // will be invoked in the browser scope
      requestInterceptor: (req: Request) => {
        // add csrf token to the request
        function getCookie(name: string) {
          const cookie = window.document.cookie;
          const value = `; ${cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
          }
        }
        const CSRF_TOKEN_HEADER = 'X-CSRF-TOKEN';
        req.headers[CSRF_TOKEN_HEADER] = getCookie(CSRF_TOKEN_HEADER);
        return req;
      },
    },
  });

  await app.listen(port);
  logger.log(`Swagger is running on http://localhost:${port}/api`, 'Swagger');

  return app;
}

export default bootstrap();
