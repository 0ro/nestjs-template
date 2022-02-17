import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilesService } from '../files/files.service';

import { CreateUserDto } from './users.dto';

import { User, UserDocument } from 'src/schemas/user.schema';
import { ApiException, CODES } from 'src/http-exception.filter';

@Injectable()
export class UsersService {
  constructor(
    private filesService: FilesService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  findAll() {
    return this.userModel.find().populate('avatar');
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('avatar', 'post')
      .exec();
    if (!user) {
      throw new ApiException(CODES.SERVER.NOT_FOUND, 'User not found', 404);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(
    data: CreateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const file = avatar ? await this.filesService.uploadFile(avatar) : null;
    const passwordHash = await User.hashPassword(data.password);

    return this.userModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      avatar: file,
    });
  }
}
