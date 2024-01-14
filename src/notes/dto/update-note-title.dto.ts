import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteTitleDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;
}
