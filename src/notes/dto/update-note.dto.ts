import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateNoteInfoDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
