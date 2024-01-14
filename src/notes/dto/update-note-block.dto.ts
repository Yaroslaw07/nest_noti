import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Block } from 'src/blocks/entities/block.entity';

export class UpdateNoteBlockDto {
  @ApiProperty({ required: true, type: [Block] })
  @IsArray()
  blocks?: Block[];
}
