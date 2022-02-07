import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post.',
    example: 'My first post',
    type: String,
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the post.',
    example: 'This is my first post',
    type: String,
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    example: '',
    required: true,
  })
  @IsMongoId()
  authorId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: never;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'The title of the post.',
    example: 'My first post',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The content of the post.',
    example: 'This is my first post',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    type: String,
    example: ``,
    required: false,
  })
  authorId?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: never;
}
