import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BatchUnit {
  @ApiProperty()
  @IsNotEmpty()
  event: string;

  @ApiProperty()
  @IsNotEmpty()
  data: any;

  @ApiProperty()
  @IsNotEmpty()
  timeStamp: number;
}
