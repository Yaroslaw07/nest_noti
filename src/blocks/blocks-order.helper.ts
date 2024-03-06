import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Block } from './entities/block.entity';

@Injectable()
export class BlockOrderHelper {
  async adjustOrderOnDelete(
    repository: Repository<Block>,
    noteId: string,
    deletedOrder: number,
  ) {
    await this.decreaseOrder(repository, noteId, deletedOrder);
  }

  async adjustOrderOnCreate(
    repository: Repository<Block>,
    noteId: string,
    createdOrder: number,
  ) {
    await this.increaseOrder(repository, noteId, createdOrder);
  }

  private async increaseOrder(
    repository: Repository<Block>,
    noteId: string,
    startOrder: number,
  ) {
    await repository
      .createQueryBuilder()
      .update(Block)
      .where('noteId = :noteId AND order >= :startOrder', {
        noteId,
        startOrder,
      })
      .set({ order: () => '"order" + 1' })
      .execute();
  }

  private async decreaseOrder(
    repository: Repository<Block>,
    noteId: string,
    startOrder: number,
  ) {
    await repository
      .createQueryBuilder()
      .update(Block)
      .where('noteId = :noteId AND order >= :startOrder', {
        noteId,
        startOrder,
      })
      .set({ order: () => '"order" - 1' })
      .execute();
  }
}
