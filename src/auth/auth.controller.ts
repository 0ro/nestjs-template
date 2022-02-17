import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

import { User } from 'src/schemas/user.schema';
import { CurrentUser } from 'src/users/users.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @CurrentUser() user: User,
    @Body() _: LoginDto,
    @Res() response: Response,
  ) {
    const cookie = this.authService.getAuthCookie(user);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    const cookie = this.authService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }
}
