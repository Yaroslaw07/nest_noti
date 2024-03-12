import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id?: string;
}
