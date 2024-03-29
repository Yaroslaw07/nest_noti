import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getVaultRoom } from 'src/socket/socket-room.helper';
import { VAULT_EVENTS } from './vault-events.helper';

@WebSocketGateway({ cors: true })
export class VaultsGateway {
  @WebSocketServer()
  server: Server;

  async afterInit() {
    console.log('Vault socket initialized');
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

  async emitEventToVault(vaultId: string, event: string, payload: any) {
    this.server.to(getVaultRoom(vaultId)).emit(event, payload);
  }

  async emitEventToVaultExceptClient(
    vaultId: string,
    event: string,
    payload: any,
    clientId: string,
  ) {
    this.server
      .to(getVaultRoom(vaultId))
      .except(clientId)
      .emit(event, payload, clientId);
  }
}
