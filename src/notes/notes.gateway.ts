import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getNoteRoom } from 'src/helpers/socket-room';
import { SocketService } from 'src/socket/socket.service';

@WebSocketGateway({ cors: true, namespace: 'notes' })
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  async afterInit() {
    console.log('Note socket initialized');
  }

  async handleConnection(client: Socket) {
    await this.socketService.handleConnection(client);
  }

  @SubscribeMessage('joinNoteRoom')
  handleJoinNoteRoom(client: Socket, noteId: string) {
    client.join(getNoteRoom(noteId));
  }
}
