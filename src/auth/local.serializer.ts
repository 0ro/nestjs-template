import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { User } from 'src/schemas/user.schema';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.usersService.findById(userId);
    done(null, user);
  }
}
