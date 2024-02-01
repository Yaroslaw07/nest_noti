import { Module } from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { VaultsController } from './vaults.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vault } from './entities/vault.entity';
import { VaultsGateway } from './vaults.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [VaultsController],
  providers: [VaultsService, VaultsGateway],
  imports: [TypeOrmModule.forFeature([Vault]), AuthModule, UsersModule],
  exports: [VaultsService, VaultsGateway],
})
export class VaultsModule {}
