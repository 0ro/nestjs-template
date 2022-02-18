import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

import { ApiException, CODES } from 'src/http-exception.filter';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.isAuthenticated()) {
      return true;
    }

    throw new ApiException(CODES.SERVER.UNAUTHORIZED, 'Unauthorized', 401);
  }

  handleRequest<TUser>(
    err: unknown,
    user: TUser,
    info: unknown & { message?: string },
  ) {
    if (err) {
      throw err;
    }
    if (info && info.message) {
      throw new ApiException(CODES.SERVER.BAD_REQUEST, info.message, 400);
    }
    return user;
  }
}
