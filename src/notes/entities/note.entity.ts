import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { NoteBlock } from 'src/note-blocks/entities/note-block.entity';
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

  @OneToMany(() => NoteBlock, (contentBlock) => contentBlock.note, {
    cascade: true,
  })
  contentBlocks: NoteBlock[];

  @ApiProperty()
  @IsDate()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ManyToOne(() => Vault, (vault) => vault.notes, {
    nullable: false,
    cascade: true,
  })
  vault: Vault;
}
