import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MyLogger } from 'src/shared/logger.service';
import { S3Service } from 'src/shared/s3.service';

@Injectable()
export class FilesService {
  constructor(
    private s3Service: S3Service,
    private prisma: PrismaService,
    private logger: MyLogger,
  ) {}

  async findAll() {
    const files = await this.prisma.file.findMany();

    return files.map((file) => ({
      ...file,
      url: this.s3Service.read(file.path),
    }));
  }

  async createFile(file: Express.Multer.File, path: string) {
    return this.prisma.file.create({
      data: {
        name: file.originalname,
        path,
        size: file.size,
        createdAt: new Date(),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const { Key } = await this.s3Service.upload(file.originalname, file);

    const createdFile = await this.createFile(file, Key);

    return { url: this.s3Service.read(Key), ...createdFile };
  }

  async uploadFiles(file: Express.Multer.File[]) {
    return Promise.all(file.map((f) => this.uploadFile(f)));
  }
}
