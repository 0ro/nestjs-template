import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiException, CODES } from 'src/http-exception.filter';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    await super.canActivate(context);

    // initialize the session
    const request = context.switchToHttp().getRequest();
    if (request.body.remember) {
      request.session.cookie.maxAge = 10 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
      request.session.cookie.expires = false; // Cookie expires at end of session
    }
    await super.logIn(request);

    // if no exceptions were thrown, allow the access to the route
    return true;
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
