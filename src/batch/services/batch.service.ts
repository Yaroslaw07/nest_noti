import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BatchRequestDto } from '../dto/batch.dto';
import { BATCH_EVENTS, getEventData } from '../batch-events.helpers';
import { BatchOperationService } from './batch-operation.service';
import { BatchUnit } from '../dto/batch-unit.dto';
import { BatchGroupService } from './batch-group.service';

@Injectable()
export class BatchService {
  constructor(
    private readonly batchOperationService: BatchOperationService,
    private readonly batchGroupService: BatchGroupService,

    @Inject(EntityManager)
    private readonly entityManager: EntityManager,
  ) {}

  async executeBatch(noteId: string, batchDto: BatchRequestDto) {
    const { batchUpdates: batchChanges, timeStamp } = batchDto;
    batchChanges.sort((a, b) => a.timeStamp - b.timeStamp);

    const groupedChanges: BatchUnit[] = this.batchGroupService
      .groupChanges(batchChanges)
      .sort((a, b) => a.timeStamp - b.timeStamp);

    console.log(groupedChanges);

    const processedChanges: BatchUnit[] = [];

    await this.entityManager.transaction(async (entityManager) => {
      try {
        for (const change of groupedChanges) {
          const { event, additionalEventInfo } = getEventData(change.event);

          const processedData = await this.batchUpdateHandler(
            event,
            change.data,
            entityManager,
            { ...additionalEventInfo, noteId },
          );

          processedChanges.push({
            event: event,
            data: processedData,
            timeStamp: change.timeStamp,
          });
        }
      } catch (error) {
        throw error;
      }
    });

    return { processedChanges, timeStamp };
  }

  async batchUpdateHandler(
    event: string,
    data: any,
    entityManager: EntityManager,
    additionalEventInfo: any,
  ) {
    console.log(event);

    switch (event) {
      case BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH:
        return await this.batchOperationService.batchUpdateNoteInfo(
          additionalEventInfo.noteId,
          data,
          entityManager,
        );
      case BATCH_EVENTS.NOTE_BLOCK_CREATED_BATCH:
        return await this.batchOperationService.batchCreateBlock(
          additionalEventInfo.noteId,
          data,
          entityManager,
        );
      case BATCH_EVENTS.NOTE_BLOCK_UPDATED_BATCH:
        return await this.batchOperationService.batchUpdateBlock(
          additionalEventInfo.blockId,
          data,
          entityManager,
        );
      case BATCH_EVENTS.NOTE_BLOCK_DELETED_BATCH:
        return await this.batchOperationService.batchDeleteBlock(
          additionalEventInfo.blockId,
          entityManager,
        );
      default:
        throw new ConflictException('Invalid batch event type:' + event);
    }
  }
}
