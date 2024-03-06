import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { BatchUnit } from './batch-unit.dto';

export class BatchRequestDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  batchUpdates: BatchUnit[];

  @ApiProperty()
  @IsNotEmpty()
  timeStamp: number;
}
