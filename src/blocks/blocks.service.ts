import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Block } from './entities/block.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
  ) {}

  async findAll(noteId: string) {
    return this.blockRepository.find({
      where: { note: { id: noteId } },
      order: { order: 'ASC' },
    });
  }

  async create(noteId: string, order: number) {
    const maxOrderBlock = await this.blockRepository
      .createQueryBuilder('block')
      .select('MAX(block.order)', 'maxOrder')
      .where('block.noteId = :noteId', { noteId })
      .getRawOne();

    if (order > maxOrderBlock.maxOrder + 1 || order < 0) {
      throw new NotFoundException(
        `Block with order ${order} can't been block in note ${noteId} cause it's out of range.`,
      );
    }

    await this.increaseOrder(noteId, order);

    const block = this.blockRepository.create({ note: { id: noteId }, order });

    return this.blockRepository.save(block);
  }

  async updateBlock(blockId: string, newType: string, newProps: any) {
    const block = await this.blockRepository.findOne({
      where: {
        id: blockId,
      },
    });

    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found.`);
    }

    block.type = newType;
    block.props = newProps;

    return this.blockRepository.save(block);
  }

  // async moveBlockToPosition(blockId: string, newOrder: number): Promise<Block> {
  //   const block = await this.blockRepository.findOne({
  //     where: { id: blockId },
  //     relations: ['note'],
  //   });

  //   if (!block) {
  //     throw new NotFoundException(`Block with ID ${blockId} not found.`);
  //   }

  //   const noteId = block.note.id;
  //   const currentOrder = block.order;

  //   if (newOrder === currentOrder) {
  //     return block;
  //   }

  //   if (newOrder < currentOrder) {
  //     await this.decreaseOrder(noteId, newOrder, currentOrder);
  //   } else {
  //     await this.increaseOrder(noteId, currentOrder, newOrder);
  //   }

  //   block.order = newOrder;

  //   return this.blockRepository.save(block);
  // }

  async deleteBlock(blockId: string): Promise<void> {
    const block = await this.blockRepository.findOne({
      where: { id: blockId },
      relations: ['note'],
    });

    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found.`);
    }

    const noteId = block.note.id;
    const order = block.order;

    await this.decreaseOrder(noteId, order);

    await this.blockRepository.remove(block);
  }

  private async increaseOrder(
    noteId: string,
    startOrder: number,
    endOrder?: number,
  ) {
    const queryBuilder = this.createOrderUpdateQueryBuilder(
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
    noteId: string,
    startOrder: number,
    endOrder?: number,
  ) {
    const queryBuilder = this.createOrderUpdateQueryBuilder(
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
    noteId: string,
    startOrder: number,
    endOrder?: number,
  ): SelectQueryBuilder<Block> {
    const queryBuilder = this.blockRepository.createQueryBuilder();
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
