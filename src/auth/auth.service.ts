import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { JwtPayload } from './auth.dto';

import { ApiException, CODES } from 'src/http-exception.filter';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async login(user: User) {
    const payload: JwtPayload = { email: user.email, userId: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
