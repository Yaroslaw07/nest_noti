import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Block } from './entities/block.entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

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
    endOrder?: number,
  ) {
    const queryBuilder = this.createOrderUpdateQueryBuilder(
      repository,
      noteId,
      startOrder,
      endOrder,
    );

    await queryBuilder
      .update()
      .set({ order: () => '"order" + 1' })
      .execute();
  }

  private async decreaseOrder(
    repository: Repository<Block>,
    noteId: string,
    startOrder: number,
    endOrder?: number,
  ) {
    const queryBuilder = this.createOrderUpdateQueryBuilder(
      repository,
      noteId,
      startOrder,
      endOrder,
    );
    await queryBuilder
      .update()
      .set({ order: () => '"order" - 1' })
      .execute();
  }

  private createOrderUpdateQueryBuilder(
    repository: Repository<Block>,
    noteId: string,
    startOrder: number,
    endOrder?: number,
  ): SelectQueryBuilder<Block> {
    const queryBuilder = repository.createQueryBuilder();
    queryBuilder.update(Block).where('noteId = :noteId', { noteId });

    if (endOrder) {
      queryBuilder.andWhere('order >= :startOrder AND order <= :endOrder', {
        startOrder,
        endOrder,
      });
    } else {
      queryBuilder.andWhere('order >= :startOrder', { startOrder });
    }

    return queryBuilder;
  }
}
