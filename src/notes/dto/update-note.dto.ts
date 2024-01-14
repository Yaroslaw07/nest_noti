import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Block } from 'src/blocks/entities/block.entity';

export class UpdateNoteDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ required: true, type: [Block] })
  @IsArray()
  blocks?: Block[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isTitleUpdated?: boolean;
}
