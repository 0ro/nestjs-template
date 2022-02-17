import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

import { User } from './user.schema';

import { File } from 'src/schemas/file.schema';

export type PostDocument = Post & Document;

@Schema({
  id: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'File', required: false })
  image?: File;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  author?: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
