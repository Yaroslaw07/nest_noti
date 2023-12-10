import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { VaultsModule } from 'src/vaults/vaults.module';

@Module({
  controllers: [NotesController],
  imports: [TypeOrmModule.forFeature([Note]), VaultsModule],
  providers: [NotesService],
})
export class NotesModule {}
