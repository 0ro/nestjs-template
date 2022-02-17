import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './auth.dto';

import { User } from 'src/schemas/user.schema';
import { CurrentUser } from 'src/users/users.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@CurrentUser() user: User, @Body() body: LoginDto) {
    return user;
  }
}