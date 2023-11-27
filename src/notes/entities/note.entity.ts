import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Note {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vaultId: string;
}
