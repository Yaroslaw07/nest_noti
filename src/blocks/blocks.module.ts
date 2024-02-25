import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { Block } from './entities/block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocksController } from './blocks.controller';
import { NotesModule } from 'src/notes/notes.module';
import { VaultsModule } from 'src/vaults/vaults.module';
import { BlockOrderHelper } from './blocks-order.helper';

@Module({
  providers: [BlocksService, BlockOrderHelper],
  imports: [TypeOrmModule.forFeature([Block]), NotesModule, VaultsModule],
  controllers: [BlocksController],
  exports: [BlocksService],
})
export class BlocksModule {}
