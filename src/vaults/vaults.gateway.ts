import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getVaultRoom } from 'src/socket/socket-room.helper';
import { SocketService } from 'src/socket/socket.service';
import { VAULT_EVENTS } from './vault-events.helper';

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

  @SubscribeMessage(VAULT_EVENTS.JOIN_VAULT_ROOM)
  async handleEnterVault(client: Socket, vaultId: string) {
    client.handshake.headers.vault_id = vaultId;
    client.join(getVaultRoom(vaultId));
  }

  @SubscribeMessage(VAULT_EVENTS.LEAVE_VAULT_ROOM)
  async handleLeaveVault(client: Socket, vaultId: string) {
    client.leave(getVaultRoom(vaultId));
    client.handshake.headers.vault_id = null;
  }

  async emitEventToVault(
    vaultId: string,
    event: string,
    payload: Record<string, any>,
  ) {
    this.server.to(getVaultRoom(vaultId)).emit(event, payload);
  }
}
