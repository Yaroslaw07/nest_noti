import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNoteInfoDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  isPinned?: boolean;
}
