import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsPositive } from 'class-validator';

export class FindOneDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  id: string;
}

export class PaginationDto {
  @ApiProperty({ required: true })
  @IsPositive()
  offset: number;

  @ApiProperty({ required: true })
  @IsPositive()
  limit: number;
}
