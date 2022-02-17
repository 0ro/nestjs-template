import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { MyLogger } from './shared/logger.service';

export const CODES = {
  SERVER: {
    INTERNAL: 'INTERNAL_ERROR',
    FORBIDDEN: 'FORBIDDEN',
    ERROR: 'SERVER__ERROR',
    NOT_FOUND: 'SERVER__NOT_FOUND',
    VALIDATION: 'SERVER__VALIDATION',
    BAD_REQUEST: 'SERVER__BAD_REQUEST',
    UNAUTHORIZED: 'SERVER__UNAUTHORIZED',
  },
  VALIDATION: {
    EXISTS: 'VALIDATION__EXISTS',
  },
};

interface IApiExceptionData {
  code: string;
  status: HttpStatus;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

export class ApiException extends HttpException {
  constructor(
    code: string = CODES.SERVER.ERROR,
    message?: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    data?: Record<string, unknown>,
  ) {
    super(
      {
        code: code.toUpperCase(),
        status: status,
        message: message || code,
        data: data,
        timestamp: new Date().toISOString(),
      } as IApiExceptionData,
      status,
    );
  }

  getResponse(): IApiExceptionData {
    return super.getResponse() as IApiExceptionData;
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: MyLogger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let apiExceptionData: IApiExceptionData = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: CODES.SERVER.ERROR,
      message: 'Internal server error',
    };

    if (exception instanceof ApiException) {
      this.logger.debug(
        `Processing ApiException on ${request.url} - ${exception.message}`,
        exception.stack,
        'ApiException',
      );

      apiExceptionData = (exception as ApiException).getResponse();
    } else if (exception instanceof HttpException) {
      this.logger.debug(
        `Processing HttpException on ${request.url} - ${exception.message}`,
        exception.stack,
        'HttpException',
      );
      const response = (exception as HttpException).getResponse() as {
        statusCode?: number;
        error?: string;
      };

      if (!response.statusCode || !response.error) {
        this.logger.warn(
          `Invalid HttpException on ${request.url}`,
          JSON.stringify({
            exception: exception,
            response: response,
            ip: request.ip,
            params: request.params,
            query: request.query,
            body: request.body,
            headers: request.headers,
          }),
          'HttpException',
        );
      }

      switch (response.error) {
        case 'Bad Request':
          apiExceptionData = {
            status: HttpStatus.BAD_REQUEST,
            code: CODES.SERVER.BAD_REQUEST,
            message: 'Bad request',
          };
          break;
        case 'Not Found':
          apiExceptionData = {
            status: HttpStatus.NOT_FOUND,
            code: CODES.SERVER.NOT_FOUND,
            message: 'Route not found',
          };
          break;
        default:
          this.logger.warn(
            `Unhandled HttpException code ${response.error}.`,
            JSON.stringify({
              exception: exception,
              code: response.error,
              path: request.url,
            }),
            'HttpException',
          );
      }
    } else {
      this.logger.error(
        `Unhandled server error on ${request.url}`,
        JSON.stringify({
          exception: exception,
          ip: request.ip,
          params: request.params,
          query: request.query,
          body: request.body,
          headers: request.headers,
        }),
        'Unhandled',
      );
    }

    response.status(apiExceptionData.status).send({
      path: request.url,
      timestamp: new Date().toISOString(),
      ...apiExceptionData,
    });
  }
}
