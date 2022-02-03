import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/files/files.service';

@Module({
  providers: [UsersService, PrismaService, FilesService],
  controllers: [UsersController],
})
export class UsersModule {}
