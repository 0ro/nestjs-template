import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiException, CODES } from 'src/http-exception.filter';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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
