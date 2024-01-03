import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { VaultsModule } from 'src/vaults/vaults.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [NotesController],
  imports: [TypeOrmModule.forFeature([Note]), VaultsModule, SocketModule],
  providers: [NotesService],
})
export class NotesModule {}
