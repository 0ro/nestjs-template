import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { ApiException, CODES } from './http-exception.filter';

const exceptionFactory: ValidationPipeOptions['exceptionFactory'] = (
  errors,
) => {
  return new ApiException(
    CODES.SERVER.VALIDATION,
    errors
      .map((error) => {
        if (!error.constraints) {
          return `Missing constraint for ${error.property}`;
        }
        return Object.values(error.constraints);
      })
      .join(', '),
    400,
  );
};

export default new ValidationPipe({
  exceptionFactory,
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
});
