import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { VaultsModule } from 'src/vaults/vaults.module';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [AuthModule, VaultsModule, NotesModule],
  providers: [SocketService, SocketGateway],
  exports: [SocketService],
})
export class SocketModule {}
