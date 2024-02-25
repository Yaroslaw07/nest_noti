import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BatchUnit {
  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  data: any;

  @ApiProperty()
  @IsNotEmpty()
  timeStamp: number;
}
