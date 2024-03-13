import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, EntityManager, EntityTarget, Repository } from 'typeorm';
import { Block } from './entities/block.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockOrderHelper } from './blocks-order.helper';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import * as uuidValidate from 'uuid-validate';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private readonly blockOrderHelper: BlockOrderHelper,
  ) {}

  async findAll(
    noteId: string,
    entityManager?: EntityManager,
  ): Promise<Block[]> {
    if (!noteId) {
      throw new Error('Invalid noteId provided');
    }

    const repository = entityManager
      ? entityManager.getRepository(Block)
      : this.blockRepository;

    return await repository.find({
      where: { note: { id: noteId } },
      order: { order: 'ASC' },
    });
  }

  async findOne(
    blockId: string,
    entityManager?: EntityManager,
  ): Promise<Block> {
    const repository = entityManager
      ? entityManager.getRepository(Block)
      : this.blockRepository;

    return await repository.findOne({
      where: { id: blockId },
    });
  }

  async create(
    noteId: string,
    createBlockDto: CreateBlockDto,
    entityManager?: EntityManager,
  ) {
    const repository = entityManager
      ? entityManager.getRepository(Block)
      : this.blockRepository;

    const { order, type, props, id } = createBlockDto;

    if (id && !uuidValidate(id)) {
      throw new ConflictException('Invalid block ID provided');
    }

    const maxOrderBlock = await repository
      .createQueryBuilder('block')
      .select('MAX(block.order)', 'maxOrder')
      .where('block.noteId = :noteId', { noteId })
      .getRawOne();

    if (order > maxOrderBlock.maxOrder + 1 || order < 0) {
      throw new NotFoundException(
        `Block with order ${order} can't be placed in note ${noteId} because it's out of range.`,
      );
    }

    await this.blockOrderHelper.adjustOrderOnCreate(repository, noteId, order);

    const createBlock = (
      entity: EntityTarget<Block>,
      data: DeepPartial<Block>,
    ) =>
      entityManager
        ? entityManager.create(entity, data)
        : this.blockRepository.create(data);

    const block = createBlock(Block, {
      note: { id: noteId },
      order,
      type: type || 'text',
      props: props || { text: '' },
      id,
    });

    try {
      return await repository.save(block);
    } catch (error) {
      console.error('Error occurred while saving block:', error);
      throw error;
    }
  }

  async updateBlock(
    blockId: string,
    newBlock: UpdateBlockDto,
    entityManager?: EntityManager,
  ) {
    const repository = entityManager
      ? entityManager.getRepository(Block)
      : this.blockRepository;

    const block = await repository.findOne({
      where: {
        id: blockId,
      },
    });

    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found.`);
    }

    const { type, props, updatedAt } = newBlock;

    const updatedTime = updatedAt ? new Date(updatedAt) : new Date();

    if (block.updatedAt > updatedTime) {
      throw new ConflictException(
        `Block with ID ${blockId} was updated by another user.`,
      );
    }

    type && (block.type = type);
    props && (block.props = props);
    block.updatedAt = updatedTime;

    return repository.save(block);
  }

  async delete(blockId: string, entityManager?: EntityManager) {
    const repository = entityManager
      ? entityManager.getRepository(Block)
      : this.blockRepository;

    const block = await repository.findOne({
      where: { id: blockId },
      relations: ['note'],
    });

    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found.`);
    }

    const noteId = block.note.id;
    const order = block.order;

    await this.blockOrderHelper.adjustOrderOnDelete(repository, noteId, order);

    await repository.remove(block);
  }
}
