import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Post } from './posts.schema';

import { File } from 'src/schemas/file.schema';

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

  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'File' })
  avatar: File;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Post' })
  posts: Post[];

  comparePassword: (password: string) => Promise<boolean>;

  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};
