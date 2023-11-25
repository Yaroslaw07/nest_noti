import { Module } from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VaultsController } from './vaults.controller';

@Module({
  controllers: [VaultsController],
  providers: [VaultsService],
  imports: [PrismaModule],
})
export class VaultsModule {}
