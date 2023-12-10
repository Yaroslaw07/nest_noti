import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Vault } from 'src/vaults/entities/vault.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ApiProperty()
  @IsString()
  @Column('text')
  content: string;

  @ApiProperty()
  @IsDate()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ManyToOne(() => Vault, (vault) => vault.notes, { nullable: false })
  vault: Vault;
}
