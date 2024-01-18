import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { getVaultRoom } from 'src/helpers/socket-room';
import { UsersService } from 'src/users/users.service';
import { VaultsService } from './vaults.service';

@WebSocketGateway({ cors: true })
export class VaultsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private vaultsService: VaultsService,
  ) {}

  async afterInit() {
    console.log('Vaults socket initialized');
  }

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

      console.log(vaultId, user.id);

      const isVaultAccessible = await this.vaultsService.checkOwnership(
        user.id,
        vaultId,
      );

      if (!isVaultAccessible) {
        client.disconnect();
        throw new WsException('Vault is not accessible');
      }

      client.join(getVaultRoom(vaultId));
    } catch (e) {
      console.log(e);
      client.disconnect();
      return;
    }
    console.log('Vaults connected');
  }

  handleDisconnect() {
    console.log('Vaults disconnected');
  }
}
