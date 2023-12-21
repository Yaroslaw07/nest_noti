import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  create(vaultId: string) {
    return this.notesRepository.save({
      title: 'Undefined',
      content: '',
      vault: {
        id: vaultId,
      },
    });
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
