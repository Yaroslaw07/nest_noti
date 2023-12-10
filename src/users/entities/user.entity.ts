import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Vault } from 'src/vaults/entities/vault.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
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
  @Column('text', { unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column('text')
  password: string;

  @ApiProperty()
  @IsArray()
  @OneToMany(() => Vault, (vault) => vault.id, {
    onDelete: 'CASCADE',
  })
  vaults: Vault[];
}
