import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './users.dto';
import { UsersService } from './users.service';

import { CookieAuthGuard } from 'src/auth/cookie-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(CookieAuthGuard)
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, avatar);
  }
}
