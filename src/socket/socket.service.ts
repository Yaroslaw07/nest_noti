import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SocketService {
  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      const { id } = await this.authService.getPayload(
        client.handshake.headers.token as string,
      );

      client.handshake.headers.user = id;

      return id;
    } catch (e) {
      console.log('error', e);
      client.disconnect();
    }
  }
}
