import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtPayload } from './auth.dto';

import { Schema } from 'src/config/env-schema';
import { UsersService } from 'src/users/users.service';
import { ApiException, CODES } from 'src/http-exception.filter';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<Schema>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<Schema['JWT']>('JWT')?.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new ApiException(CODES.SERVER.NOT_FOUND, 'User not found', 404);
    }
    return user;
  }
}
