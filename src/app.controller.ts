import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('/csrf')
  getCsrf(@Req() req: Request): string {
    return req.csrfToken();
  }
}
