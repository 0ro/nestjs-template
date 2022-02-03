import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  firstName: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  lastName: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: never;
}
