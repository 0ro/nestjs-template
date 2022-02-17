import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiException, CODES } from 'src/http-exception.filter';
import { MyLogger } from 'src/shared/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: MyLogger) {
    super();
  }
  handleRequest<TUser>(
    err: unknown,
    user: TUser,
    info: unknown & { message?: string },
  ) {
    if (err) {
      throw err;
    }
    if (user) {
      return user;
    }
    if (info && info.message) {
      switch (info.message.toUpperCase()) {
        case 'NO AUTH TOKEN':
          throw new ApiException(
            CODES.SERVER.BAD_REQUEST,
            'No auth token',
            400,
          );
        case 'JWT EXPIRED':
          throw new ApiException(CODES.SERVER.UNAUTHORIZED, 'jwt expired', 401);
        default:
          break;
      }
    }

    this.logger.error(
      'Unknown auth error',
      JSON.stringify({
        error: err,
        user: user,
        info: info,
      }),
      'AuthGuard',
    );
    throw new ApiException(CODES.SERVER.ERROR, 'Server error', 500);
  }
}
