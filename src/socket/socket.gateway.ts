import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { VaultsService } from 'src/vaults/vaults.service';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private vaultsService: VaultsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const { id } = await this.authService.getPayload(
        client.handshake.headers.token as string,
      );

      const user = await this.usersService.findOne(id);

      if (!user) {
        client.disconnect();
        throw new WsException('User not found');
      }

      const vaultId = client.handshake.query.vaultId as string;

      const isVaultAccessible = await this.vaultsService.checkOwnership(
        user.id,
        vaultId,
      );

      if (!isVaultAccessible) {
        client.disconnect();
        throw new WsException('Vault is not accessible');
      }

      client.join(client.handshake.query.vaultId);
    } catch (e) {
      client.disconnect();
    }
  }
}
