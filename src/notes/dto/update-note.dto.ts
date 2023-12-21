import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  content?: string;
}
