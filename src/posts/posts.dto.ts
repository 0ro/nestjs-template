import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post.',
    example: 'My first post',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'The content of the post.',
    example: 'This is my first post',
    type: String,
    required: true,
  })
  content: string;

  @ApiProperty({
    type: String,
    example: ``,
    required: true,
  })
  authorId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: never;
}
