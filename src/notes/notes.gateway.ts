import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getNoteRoom } from 'src/socket/socket-room.helper';
import { NOTE_EVENTS, NOTE_INFOS_EVENTS } from './note-events.helper';
import { NotesService } from './services/notes.service';
import { VaultsGateway } from 'src/vaults/vaults.gateway';

@WebSocketGateway({ cors: true })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly noteService: NotesService,
    private readonly vaultsGateway: VaultsGateway,
  ) {}

  async afterInit() {
    console.log('Note socket initialized');
  }

  @SubscribeMessage(NOTE_EVENTS.JOIN_NOTE_ROOM)
  handleJoinNoteRoom(client: Socket, noteId: string) {
    console.log('noteId', noteId);
    client.join(getNoteRoom(noteId));
    client.handshake.headers.note_id = noteId;
  }

  @SubscribeMessage(NOTE_EVENTS.LEAVE_NOTE_ROOM)
  handleLeaveNoteRoom(client: Socket, noteId: string) {
    client.leave(getNoteRoom(noteId));
    client.handshake.headers.note_id = null;
  }

  @SubscribeMessage(NOTE_EVENTS.TO_UPDATE_NOTE_TITLE)
  async handleUpdateNoteTitle(
    @ConnectedSocket() client,
    @MessageBody() payload: any,
  ) {
    const { noteId, newTitle } = payload;
    const { vault_id } = client.handshake.headers;

    const updatedNote = await this.noteService.updateTitle(noteId, newTitle);

    this.emitEventToNote(noteId, NOTE_EVENTS.NOTE_TITLE_UPDATED, {
      title: updatedNote.title,
    });

    this.vaultsGateway.emitEventToVault(
      vault_id,
      NOTE_INFOS_EVENTS.NOTE_INFOS_UPDATED,
      updatedNote,
    );
  }

  async emitEventToNote(
    noteId: string,
    event: string,
    payload: Record<string, any>,
  ) {
    this.server.to(getNoteRoom(noteId)).emit(event, payload);
  }
}
