import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVaultDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
