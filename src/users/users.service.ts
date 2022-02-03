import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './users.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        posts: {
          where: {
            published: false,
          },
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async createUser(
    data: CreateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const file = avatar ? await this.filesService.uploadFile(avatar) : null;
    const user = await this.prisma.user.create({
      include: {
        posts: true,
        profile: {
          include: {
            avatar: true,
          },
        },
      },
      data: {
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: {
              connect: file ? { id: file.id } : void 0,
            },
          },
        },
      },
    });

    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
