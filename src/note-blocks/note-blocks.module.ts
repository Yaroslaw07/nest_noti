import { Module } from '@nestjs/common';
import { NoteBlocksService } from './note-blocks.service';
import { NoteBlocksController } from './note-blocks.controller';
import { NoteBlock } from './entities/note-block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [NoteBlocksController],
  providers: [NoteBlocksService],
  imports: [TypeOrmModule.forFeature([NoteBlock])],
  exports: [NoteBlocksService],
})
export class NoteBlocksModule {}
