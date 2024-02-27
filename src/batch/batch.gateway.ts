import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BatchService } from './services/batch.service';
import { NOTE_SOCKET_EVENTS } from 'src/notes/note-events.helper';
import { BatchRequestDto } from './dto/batch.dto';
import { NotesGateway } from 'src/notes/notes.gateway';
import { VaultsGateway } from 'src/vaults/vaults.gateway';

@WebSocketGateway({ cors: true })
export class BatchGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly batchService: BatchService,
    private readonly notesGateway: NotesGateway,
    private readonly vaultsGateway: VaultsGateway,
  ) {}

  async afterInit() {
    console.log('Batch socket initialized');
  }

  @SubscribeMessage(NOTE_SOCKET_EVENTS.TO_BATCH_UPDATE_NOTE)
  async executeBatch(socket: Socket, payload: BatchRequestDto) {
    const noteId = socket.handshake.headers.note_id as string;
    const vaultId = socket.handshake.headers.vault_id as string;

    if (!noteId && !vaultId) {
      console.error('Note ID missing in headers');
      return { error: 'Note ID missing in headers' };
    }

    try {
      const result = await this.batchService.executeBatch(noteId, payload);
      this.notesGateway.emitEventToNoteExceptClient(
        noteId,
        NOTE_SOCKET_EVENTS.UPDATED_BATCH_NOTE,
        result,
        socket.id,
      );

      const index = result.processedChanges.findIndex(
        (change) => change.type === 'noteInfo-Updated',
      );

      if (index !== -1) {
        this.vaultsGateway.emitEventToVault(vaultId, 'vault-Updated', {
          updatedNote: result.processedChanges[index].data,
          timeStamp: result.timeStamp,
        });
      }

      return result;
    } catch (error) {
      console.error('Error executing batch:', error);
      return { error: 'Error executing batch' };
    }
  }
}
