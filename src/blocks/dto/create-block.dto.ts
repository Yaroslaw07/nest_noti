import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreateBlockDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('text', { default: 'text' })
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column('jsonb', { default: { text: '' } })
  @IsOptional()
  props: any;
}
