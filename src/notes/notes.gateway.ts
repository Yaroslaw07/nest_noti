import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getNoteRoom } from 'src/socket/socket-room.helper';
import { NOTE_SOCKET_EVENTS } from './note-events.helper';

@WebSocketGateway({ cors: true })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  async afterInit() {
    console.log('Note socket initialized');
  }

  @SubscribeMessage(NOTE_SOCKET_EVENTS.JOIN_NOTE_ROOM)
  handleJoinNoteRoom(client: Socket, noteId: string) {
    client.join(getNoteRoom(noteId));
    client.handshake.headers.note_id = noteId;
  }

  @SubscribeMessage(NOTE_SOCKET_EVENTS.LEAVE_NOTE_ROOM)
  handleLeaveNoteRoom(client: Socket, noteId: string) {
    client.leave(getNoteRoom(noteId));
    client.handshake.headers.note_id = null;
  }

  async emitEventToNote(noteId: string, event: string, payload: any) {
    this.server.to(getNoteRoom(noteId)).emit(event, payload);
  }

  async emitEventToNoteExceptClient(
    noteId: string,
    event: string,
    payload: any,
    clientId: string,
  ) {
    this.server
      .to(getNoteRoom(noteId))
      .except(clientId)
      .emit(event, payload, clientId);
  }
}
