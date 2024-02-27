import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { NotesModule } from 'src/notes/notes.module';
import { BlocksModule } from 'src/blocks/blocks.module';
import { VaultsModule } from 'src/vaults/vaults.module';
import { BatchService } from './services/batch.service';
import { AuthModule } from 'src/auth/auth.module';
import { BatchGateway } from './batch.gateway';
import { BatchOperationService } from './services/batch-operation.service';
import { BatchGroupService } from './services/batch-group.service';

@Module({
  controllers: [BatchController],
  providers: [
    BatchService,
    BatchOperationService,
    BatchGroupService,
    BatchGateway,
  ],
  imports: [NotesModule, BlocksModule, VaultsModule, AuthModule],
})
export class BatchModule {}
