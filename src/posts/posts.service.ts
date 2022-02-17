import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePostDto, UpdatePostDto } from './posts.dto';

import { PaginationDto } from 'src/dto/common.dto';
import { FilesService } from 'src/files/files.service';
import { Post, PostDocument } from 'src/schemas/posts.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  findAll(options: PaginationDto) {
    return this.postModel
      .find({
        offset: options.offset,
        limit: options.limit,
      })
      .populate('author')
      .populate('image');
  }

  async create(data: CreatePostDto, file?: Express.Multer.File): Promise<Post> {
    const [author, image] = await Promise.all([
      this.usersService.findById(data.authorId),
      file ? this.filesService.uploadFile(file) : null,
    ]);

    return this.postModel.create({
      title: data.title,
      content: data.content,
      image,
      author: author,
    });
  }

  async update(
    postId: string,
    data: UpdatePostDto,
    file?: Express.Multer.File,
  ) {
    let image;
    try {
      image = file ? await this.filesService.uploadFile(file) : null;

      return this.postModel
        .findByIdAndUpdate(
          {
            _id: postId,
          },
          {
            ...data,
            image,
          },
          {
            new: true,
          },
        )
        .exec();
    } catch {
      if (image) {
        await this.filesService.delete(image.path);
      }
    }
  }
}
