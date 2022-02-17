import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

import { JwtPayload } from './auth.dto';

import { ApiException, CODES } from 'src/http-exception.filter';
import { User } from 'src/schemas/user.schema';
import { Schema } from 'src/config/env-schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Schema>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new ApiException(
        CODES.SERVER.BAD_REQUEST,
        'Wrong email or password',
        400,
      );
    }
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      return user;
    } else {
      throw new ApiException(
        CODES.SERVER.BAD_REQUEST,
        'Wrong email or password',
        400,
      );
    }
  }

  getAuthCookie(user: User) {
    const payload: JwtPayload = { userId: user.id };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${
      this.configService.get('JWT')?.expiresIn
    }`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
