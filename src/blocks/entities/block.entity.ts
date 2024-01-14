import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Note } from 'src/notes/entities/note.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Block {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('text', { default: 'text' })
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('jsonb', { default: { text: '' } })
  props: any;

  @ManyToOne(() => Note, (note) => note.blocks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'noteId' })
  note: Note;
}
