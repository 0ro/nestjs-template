import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { File } from 'src/schemas/file.schema';
import { Post } from './posts.schema';

export type UserDocument = User & Document;

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
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'File' })
  avatar: File;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post' })
  posts: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
