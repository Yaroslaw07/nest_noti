import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isTitleUpdated?: boolean;
}
