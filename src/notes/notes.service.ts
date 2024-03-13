import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { UpdateNoteInfoDto } from './dto/update-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(vaultId: string, createNoteDto: CreateNoteDto) {
    const { id } = createNoteDto;

    const savedNote = await this.notesRepository.save({
      id: id,
      title: 'Undefined',
      vault: {
        id: vaultId,
      },
    });

    return savedNote;
  }

  async findAll(vaultId: string) {
    const notes = await this.notesRepository.find({
      where: {
        vault: {
          id: vaultId,
        },
      },
    });

    const timeStamp = new Date();

    return { notes, timeStamp };
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

    const timeStamp = new Date();

    return { note, timeStamp };
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

    const { title, isPinned, updatedAt } = updateNoteInfoDto;

    const updatedTime = updatedAt ? new Date(updatedAt) : new Date();

    if (existingNote.updatedAt > updatedTime) {
      throw new ConflictException('Note was updated by another user');
    }

    title && (existingNote.title = title);
    isPinned !== undefined && (existingNote.isPinned = isPinned);
    existingNote.updatedAt = updatedTime;

    return repository.save(existingNote);
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
