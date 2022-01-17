import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/shared/s3.service';

@Injectable()
export class FilesService {
  constructor(private s3Service: S3Service, private prisma: PrismaService) {}
  async uploadFile(file: Express.Multer.File) {
    console.log(file);

    const { Key } = await this.s3Service.upload(file.originalname, file);

    // TODO: save the URL to the database

    this.prisma.file.create({
      data: {
        name: file.originalname,
        path: Key,
        size: file.size,
        createdAt: new Date(),
      },
    });
  }
}
