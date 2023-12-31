import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Note } from 'src/notes/entities/note.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vault {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('text')
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.vaults, { nullable: false })
  owner: User;

  @ApiProperty()
  @IsArray()
  @OneToMany(() => Note, (note) => note.id, {
    onDelete: 'CASCADE',
  })
  notes: Note[];
}
