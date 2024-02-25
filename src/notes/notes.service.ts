import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { UpdateNoteInfoDto } from './dto/update-note-info.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(vaultId: string) {
    const savedNote = await this.notesRepository.save({
      title: 'Undefined',
      vault: {
        id: vaultId,
      },
    });

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
      throw new NotFoundException('Note does not exist');
    }

    return note;
  }

  async findOneWithVault(noteId: string) {
    const note = this.notesRepository.findOne({
      where: {
        id: noteId,
      },
      relations: ['vault'],
    });

    if (!note) {
      throw new NotFoundException('Note does not exist');
    }

    return note;
  }

  async updateNoteInfo(
    noteId: string,
    updateNoteInfoDto: UpdateNoteInfoDto,
    entityManager?: EntityManager,
  ) {
    const { title, isPinned } = updateNoteInfoDto;

    const repository = entityManager
      ? entityManager.getRepository(Note)
      : this.notesRepository;

    const existingNote = await repository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!existingNote) {
      throw new NotFoundException('Note does not exist');
    }

    return repository.save({
      ...existingNote,
      title: title && title !== '' ? title : existingNote.title,
      isPinned: isPinned !== undefined ? isPinned : existingNote.isPinned,
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
      throw new NotFoundException('Note does not exist');
    }

    return this.notesRepository.remove(existingNote);
  }
}
