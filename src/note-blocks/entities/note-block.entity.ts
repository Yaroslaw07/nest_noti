import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Note } from 'src/notes/entities/note.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NoteBlock {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('text', { default: 'text' })
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('jsonb', { default: { text: '' } })
  content: any;

  @ManyToOne(() => Note, (note) => note.contentBlocks, { onDelete: 'CASCADE' })
  note: Note;
}
