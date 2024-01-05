import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from 'src/users/users.module';
import { VaultsModule } from 'src/vaults/vaults.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule, VaultsModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway],
})
export class SocketModule {}
