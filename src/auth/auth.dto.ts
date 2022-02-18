import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}

export class JwtPayload {
  userId: string;
}
