import { Injectable } from '@nestjs/common';
import { BlocksService } from 'src/blocks/blocks.service';
import { CreateBlockDto } from 'src/blocks/dto/create-block.dto';
import { UpdateBlockDto } from 'src/blocks/dto/update-block.dto';
import { UpdateNoteInfoDto } from 'src/notes/dto/update-note-info.dto';
import { NotesService } from 'src/notes/notes.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class BatchOperationService {
  constructor(
    private readonly notesService: NotesService,
    private readonly blocksService: BlocksService,
  ) {}

  async batchUpdateNoteInfo(
    noteId: string,
    data: UpdateNoteInfoDto,
    entityManager: EntityManager,
  ) {
    return await this.notesService.updateNoteInfo(noteId, data, entityManager);
  }

  async batchCreateBlock(
    noteId: string,
    data: CreateBlockDto,
    entityManager: EntityManager,
  ) {
    return await this.blocksService.create(noteId, data, entityManager);
  }

  async batchUpdateBlock(
    blockId: string,
    data: UpdateBlockDto,
    entityManager: EntityManager,
  ) {
    return await this.blocksService.updateBlock(blockId, data, entityManager);
  }

  async batchDeleteBlock(blockId: string, entityManager: EntityManager) {
    return await this.blocksService.delete(blockId, entityManager);
  }
}
