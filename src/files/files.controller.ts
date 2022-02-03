import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiMultiFile } from 'src/shared/decorators/api-multi-file.decorator';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('files')
  @UseInterceptors(FilesInterceptor('files'))
  upload(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.filesService.uploadFiles(files);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }
}
