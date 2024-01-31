import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getVaultRoom } from 'src/helpers/socket-room';
import { SocketService } from 'src/socket/socket.service';

@WebSocketGateway({ cors: true, namespace: 'vaults' })
export class VaultsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  async afterInit() {
    console.log('Vaults socket initialized');
  }

  async handleConnection(client: Socket) {
    await this.socketService.handleConnection(client);
  }

  @SubscribeMessage('joinVault')
  async handleEnterVault(client: Socket, vaultId: string) {
    client.handshake.headers.vault_id = vaultId;
    client.join(getVaultRoom(vaultId));
  }

  async emitEventToVault(
    vaultId: string,
    event: string,
    payload: Record<string, any>,
  ) {
    this.server.to(getVaultRoom(vaultId)).emit(event, payload);
  }
}
