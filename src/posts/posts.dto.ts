import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreatePostDto implements Omit<Prisma.PostCreateInput, 'author'> {
  @ApiProperty({
    description: 'The title of the post.',
    example: 'My first post',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  published?: boolean;

  @ApiProperty({
    type: Number,
    example: ``,
    required: true,
  })
  authorId: number;
}
