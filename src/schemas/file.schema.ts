import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({
  id: true,
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class File {
  @Prop()
  name: string;

  @Prop()
  path: string;

  @Prop()
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
