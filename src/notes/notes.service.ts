import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteBlocksService } from 'src/note-blocks/note-blocks.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private noteBlocksService: NoteBlocksService,
  ) {}

  async create(vaultId: string) {
    const savedNote = await this.notesRepository.save({
      title: 'Undefined',
      vault: {
        id: vaultId,
      },
    });

    const firstBlock = await this.noteBlocksService.create(savedNote.id);

    savedNote.contentBlocks = [firstBlock];

    return savedNote;
  }

  findAll(vaultId: string) {
    return this.notesRepository.find({
      where: {
        vault: {
          id: vaultId,
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });
  }

  findOne(noteId: string) {
    return this.notesRepository.findOne({
      where: {
        id: noteId,
      },
      relations: ['contentBlocks'],
    });
  }

  async update(noteId: string, newTitle: string, newContent: string) {
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
      content: newContent,
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
