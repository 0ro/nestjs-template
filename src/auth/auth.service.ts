import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { ApiException, CODES } from 'src/http-exception.filter';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
