import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBlockDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  props: any;
}
