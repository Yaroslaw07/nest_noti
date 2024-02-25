import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { BlocksService } from 'src/blocks/blocks.service';
import { EntityManager } from 'typeorm';
import { UpdateBlockDto as UpdateBlockTypeDto } from 'src/blocks/dto/update-block.dto';
import { CreateBlockDto } from 'src/blocks/dto/create-block.dto';
import { NOTE_BATCH_EVENTS } from 'src/notes/note-events.helper';
import { UpdateNoteInfoDto } from 'src/notes/dto/update-note-info.dto';
import { NotesService } from 'src/notes/notes.service';
import { BatchRequestDto } from './dto/batch.dto';

@Injectable()
export class BatchService {
  constructor(
    private readonly notesService: NotesService,
    private readonly blocksService: BlocksService,

    @Inject(EntityManager)
    private readonly entityManager: EntityManager,
  ) {}

  async executeBatch(noteId: string, batchDto: BatchRequestDto) {
    const processedChanges: Array<{ type: string; data: any }> = [];

    const { batchChanges, timeStamp } = batchDto;
    batchChanges.sort((a, b) => a.timeStamp - b.timeStamp);

    try {
      this.entityManager.transaction(async (entityManager) => {
        for (const change of batchChanges) {
          let eventType: string = change.type;
          let blockId: string | undefined;

          if (
            change.type.startsWith(
              NOTE_BATCH_EVENTS.NOTE_BLOCK_TYPE_UPDATED_BATCH,
            ) ||
            change.type.startsWith(NOTE_BATCH_EVENTS.NOTE_BLOCK_DELETED_BATCH)
          ) {
            const [eventBaseType, extractedBlockId] = change.type.split('-');
            eventType = eventBaseType || change.type;
            blockId = extractedBlockId;
          }

          this.batchUpdateHandler(
            eventType,
            change.data,
            entityManager,
            blockId ? blockId : noteId,
          );
        }
        return { processedChanges, timeStamp };
      });
    } catch (error) {
      return new ConflictException('Error while processing batch changes');
    }
  }

  async batchUpdateHandler(
    event: string,
    data: any,
    entityManager: EntityManager,
    identifier: string,
  ) {
    switch (event) {
      case NOTE_BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH:
        return await this.batchUpdateNoteInfo(identifier, data, entityManager);
      case NOTE_BATCH_EVENTS.NOTE_BLOCK_CREATED_BATCH:
        return await this.batchCreateBlock(identifier, data, entityManager);
      case NOTE_BATCH_EVENTS.NOTE_BLOCK_TYPE_UPDATED_BATCH:
        return await this.batchUpdateBlock(identifier, data, entityManager);
      case NOTE_BATCH_EVENTS.NOTE_BLOCK_DELETED_BATCH:
        return await this.batchDeleteBlock(identifier, entityManager);
      default:
        return new ConflictException('Invalid batch event type');
    }
  }

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
    data: UpdateBlockTypeDto,
    entityManager: EntityManager,
  ) {
    return await this.blocksService.updateBlock(blockId, data, entityManager);
  }

  async batchDeleteBlock(blockId: string, entityManager: EntityManager) {
    return await this.blocksService.delete(blockId, entityManager);
  }
}
