import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NotesGateway } from './notes.gateway';
import { Block } from 'src/blocks/entities/block.entity';
import { VaultsModule } from 'src/vaults/vaults.module';
import { AuthModule } from 'src/auth/auth.module';
import { SocketModule } from 'src/socket/socket.module';
import { NotesService } from './services/notes.service';
import { NotesSocketService } from './services/notes-socket.service';

@Module({
  controllers: [NotesController],
  imports: [
    TypeOrmModule.forFeature([Note]),
    TypeOrmModule.forFeature([Block]),
    AuthModule,
    SocketModule,
    VaultsModule,
  ],
  providers: [NotesService, NotesSocketService, NotesGateway],
  exports: [NotesGateway, NotesService, NotesSocketService],
})
export class NotesModule {}
