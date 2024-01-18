import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NotesGateway } from './notes.gateway';
import { Block } from 'src/blocks/entities/block.entity';
import { VaultsModule } from 'src/vaults/vaults.module';

@Module({
  controllers: [NotesController],
  imports: [
    TypeOrmModule.forFeature([Note]),
    TypeOrmModule.forFeature([Block]),
    VaultsModule,
  ],
  providers: [NotesService, NotesGateway],
  exports: [NotesService, NotesGateway],
})
export class NotesModule {}
