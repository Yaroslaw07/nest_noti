import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NotesGateway } from './notes.gateway';
import { Block } from 'src/blocks/entities/block.entity';
import { VaultsModule } from 'src/vaults/vaults.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotesService } from './services/notes.service';

@Module({
  controllers: [NotesController],
  imports: [
    TypeOrmModule.forFeature([Note]),
    TypeOrmModule.forFeature([Block]),
    AuthModule,
    VaultsModule,
  ],
  providers: [NotesService, NotesGateway],
  exports: [NotesGateway, NotesService],
})
export class NotesModule {}
