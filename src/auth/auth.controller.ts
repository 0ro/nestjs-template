import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { CookieAuthGuard } from './cookie-auth.guard';

import { User } from 'src/schemas/user.schema';
import { CurrentUser } from 'src/users/users.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@CurrentUser() user: User, @Body() body: LoginDto) {
    return user;
  }

  @UseGuards(CookieAuthGuard)
  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    request.logout();
    request.session.cookie.maxAge = 0;
    return response.send();
  }
}
