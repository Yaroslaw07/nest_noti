import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { BatchUnit } from './batch-change.dto';

export class BatchRequestDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  batchChanges: BatchUnit[];

  @ApiProperty()
  @IsNotEmpty()
  timeStamp: number;
}
