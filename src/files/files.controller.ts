import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileDto } from './files.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  upload(
    @Body() body: UploadFileDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.filesService.uploadFiles(files);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.filesService.findById(id);
  }
}
