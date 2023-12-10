import { Module } from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { VaultsController } from './vaults.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vault } from './entities/vault.entity';

@Module({
  controllers: [VaultsController],
  providers: [VaultsService],
  imports: [TypeOrmModule.forFeature([Vault])],
  exports: [VaultsService],
})
export class VaultsModule {}
