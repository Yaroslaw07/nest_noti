import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Block } from 'src/blocks/entities/block.entity';
import { Vault } from 'src/vaults/entities/vault.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Note {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('text')
  title: string;

  @OneToMany(() => Block, (block) => block.note)
  blocks: Block[];

  @ApiProperty()
  @IsDate()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ManyToOne(() => Vault, (vault) => vault.notes, {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: true,
  })
  vault: Vault;
}
