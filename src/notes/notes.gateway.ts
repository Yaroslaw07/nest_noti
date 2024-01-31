import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getNoteRoom } from 'src/helpers/socket-room';
import { SocketService } from 'src/socket/socket.service';
import { NOTE_EVENTS } from './note-events.helper';
import { NotesService } from './services/notes.service';

@WebSocketGateway({ cors: true, namespace: 'notes' })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly noteService: NotesService,
  ) {}

  async afterInit() {
    console.log('Note socket initialized');
  }

  async handleConnection(client: Socket) {
    await this.socketService.handleConnection(client);
  }

  @SubscribeMessage(NOTE_EVENTS.JOIN_NOTE_ROOM)
  handleJoinNoteRoom(client: Socket, noteId: string) {
    client.join(getNoteRoom(noteId));
  }

  @SubscribeMessage(NOTE_EVENTS.LEAVE_NOTE_ROOM)
  handleLeaveNoteRoom(client: Socket, noteId: string) {
    client.leave(getNoteRoom(noteId));
  }

  @SubscribeMessage('hi')
  async handleUpdateNoteTitle(@MessageBody() payload: any) {
    const [noteId, newTitle] = payload;
    const updatedNote = await this.noteService.updateTitle(noteId, newTitle);
    console.log('update note title', updatedNote);
    this.server
      .to(getNoteRoom(updatedNote.id))
      .emit(NOTE_EVENTS.NOTE_TITLE_UPDATED, {
        title: updatedNote.title,
      });
  }
}
