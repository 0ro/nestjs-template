import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsValidPassword } from 'src/utils/validation';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsValidPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: never;
}
