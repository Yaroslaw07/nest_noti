import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NoteBlock } from './entities/note-block.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NoteBlocksService {
  constructor(
    @InjectRepository(NoteBlock)
    private notesBlockRepository: Repository<NoteBlock>,
  ) {}

  async create(noteId: string) {
    return this.notesBlockRepository.save({
      note: {
        id: noteId,
      },
    });
  }

  async update(noteBlockId: string, newContent: JSON) {
    const existingNoteBlock = await this.notesBlockRepository.findOne({
      where: {
        id: noteBlockId,
      },
    });

    if (!existingNoteBlock) {
      throw new ConflictException('Note block does not exist');
    }

    return this.notesBlockRepository.save({
      ...existingNoteBlock,
      content: newContent,
    });
  }

  async delete(noteBlockId: string, noteId: string) {
    const contentBlockCount = await this.notesBlockRepository.count({
      where: {
        id: noteBlockId,
        note: {
          id: noteId,
        },
      },
    });

    if (!contentBlockCount) {
      throw new ConflictException('Note block does not exist');
    }

    const existingNoteBlock = await this.notesBlockRepository.findOne({
      where: {
        id: noteBlockId,
      },
    });

    return this.notesBlockRepository.remove(existingNoteBlock);
  }
}
