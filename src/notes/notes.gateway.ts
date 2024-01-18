import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getNoteRoom } from 'src/helpers/socket-room';

@WebSocketGateway({ cors: true, namespace: 'notes' })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection() {
    console.log('Note connected');
  }

  @SubscribeMessage('joinNoteRoom')
  handleJoinNoteRoom(client: Socket, noteId: string) {
    client.join(getNoteRoom(noteId));
    console.log(`Client ${client.id} joined note room: ${noteId}`);
  }
}
