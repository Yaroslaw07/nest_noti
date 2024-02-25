import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BatchService } from './batch.service';
import { NOTE_SOCKET_EVENTS } from 'src/notes/note-events.helper';
import { BatchRequestDto } from './dto/batch.dto';
import { NotesGateway } from 'src/notes/notes.gateway';

@WebSocketGateway({ cors: true })
export class BatchGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly batchService: BatchService,
    private readonly notesGateway: NotesGateway,
  ) {}

  async afterInit() {
    console.log('Batch socket initialized');
  }

  @SubscribeMessage(NOTE_SOCKET_EVENTS.TO_BATCH_UPDATE_NOTE)
  async executeBatch(socket: Socket, payload: BatchRequestDto) {
    const noteId = socket.handshake.headers.note_id as string;

    if (!noteId) {
      return null;
    }

    const result = await this.batchService.executeBatch(noteId, payload);

    this.notesGateway.emitEventToNote(
      noteId,
      NOTE_SOCKET_EVENTS.TO_BATCH_UPDATE_NOTE,
      result,
    );
  }
}
