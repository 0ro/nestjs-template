import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { Post, PostDocument } from 'src/schemas/posts.schema';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  findAll() {
    return this.postModel.find().populate('author', 'image');
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
}
