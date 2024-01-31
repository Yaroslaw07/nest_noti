import { Injectable } from '@nestjs/common';
import { NotesGateway } from '../notes.gateway';
import { getNoteRoom } from 'src/helpers/socket-room';

@Injectable()
export class NotesSocketService {
  constructor(private readonly notesGateway: NotesGateway) {}

  async emitEventToNote(
    noteId: string,
    event: string,
    payload: Record<string, any>,
  ) {
    this.notesGateway.server.to(getNoteRoom(noteId)).emit(event, payload);
  }
}
