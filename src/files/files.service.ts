import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '../dto/common.dto';
import { ApiException, CODES } from '../http-exception.filter';
import { File, FileDocument } from '../schemas/file.schema';
import { S3Service } from '../shared/s3.service';

@Injectable()
export class FilesService {
  constructor(
    private s3Service: S3Service,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async findAll(filters: PaginationDto) {
    const files = await this.fileModel
      .find({
        offset: filters.offset,
        limit: filters.limit,
      })
      .exec();

    return files.map((file) => ({
      ...file.toJSON(),
      url: this.s3Service.read(file.path),
    }));
  }

  async findById(id: string) {
    const file = await this.fileModel.findById(id).exec();

    if (!file) {
      throw new ApiException(CODES.SERVER.NOT_FOUND, 'File not found', 404);
    }

    return {
      ...file.toJSON(),
      url: this.s3Service.read(file.path),
    };
  }

  async create(file: Express.Multer.File, path: string) {
    return this.fileModel.create({
      ...file,
      name: file.originalname,
      size: file.size,
      path,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const { Key } = await this.s3Service.upload(file.originalname, file);
    return this.create(file, Key);
  }

  async uploadFiles(file: Express.Multer.File[]) {
    return Promise.all(file.map((f) => this.uploadFile(f)));
  }

  async delete(fileValue: string | FileDocument) {
    const file =
      typeof fileValue === 'string'
        ? await this.fileModel.findById(fileValue).exec()
        : fileValue;
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return this.s3Service.delete(file.path);
  }
}
