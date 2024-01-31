import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { Block } from 'src/blocks/entities/block.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(Block)
    private blocksRepository: Repository<Block>,
  ) {}

  async create(vaultId: string) {
    const savedNote = await this.notesRepository.save({
      title: 'Undefined',
      vault: {
        id: vaultId,
      },
    });

    const firstBlock = await this.blocksRepository.save({
      note: {
        id: savedNote.id,
      },
      content: '',
      order: 0,
    });

    savedNote.blocks = [firstBlock];

    return savedNote;
  }

  findAll(vaultId: string) {
    return this.notesRepository.find({
      where: {
        vault: {
          id: vaultId,
        },
      },
    });
  }

  async findOne(noteId: string) {
    const note = await this.notesRepository.findOne({
      where: {
        id: noteId,
      },
      relations: ['blocks'],
    });

    if (!note) {
      throw new ConflictException('Note does not exist');
    }

    return note;
  }

  async findOneWithVault(noteId: string) {
    return this.notesRepository.findOne({
      where: {
        id: noteId,
      },
      relations: ['vault'],
    });
  }

  async update(noteId: string, newTitle: string, blocks: Block[]) {
    const existingNote = await this.notesRepository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!existingNote) {
      throw new ConflictException('Note does not exist');
    }

    for (const block of blocks) {
      await this.blocksRepository.save({
        ...block,
        note: {
          id: noteId,
        },
      });
    }

    return this.notesRepository.save({
      ...existingNote,
      title: newTitle,
      blocks: blocks,
      updatedAt: new Date(),
    });
  }

  async updateTitle(noteId: string, newTitle: string) {
    const existingNote = await this.notesRepository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!existingNote) {
      throw new ConflictException('Note does not exist');
    }

    return this.notesRepository.save({
      ...existingNote,
      title: newTitle,
      updatedAt: new Date(),
    });
  }

  async updateBlocks(noteId: string, blocks: Block[]) {
    const existingNote = await this.notesRepository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!existingNote) {
      throw new ConflictException('Note does not exist');
    }

    for (const block of blocks) {
      await this.blocksRepository.save({
        ...block,
        note: {
          id: noteId,
        },
      });
    }

    return this.notesRepository.save({
      ...existingNote,
      blocks: blocks,
      updatedAt: new Date(),
    });
  }

  async remove(noteId: string) {
    const existingNote = await this.notesRepository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!existingNote) {
      throw new ConflictException('Note does not exist');
    }

    return this.notesRepository.remove(existingNote);
  }
}
