import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BatchService } from './services/batch.service';
import { BatchRequestDto } from './dto/batch.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { NoteAccessGuard } from 'src/notes/note-access.guard';
import { NoteId } from 'src/notes/note.decorator';
import { NotesGateway } from 'src/notes/notes.gateway';
import { NOTE_SOCKET_EVENTS } from 'src/notes/note-events.helper';
import { VaultsGateway } from 'src/vaults/vaults.gateway';
import { VaultId } from 'src/vaults/vault.decorator';
import { VAULT_EVENTS } from 'src/vaults/vault-events.helper';

@Controller('batch')
@UseGuards(JwtAuthGuard, NoteAccessGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'vault_id',
  required: true,
})
@ApiHeader({
  name: 'note_id',
  required: true,
})
export class BatchController {
  constructor(
    private readonly batchService: BatchService,
    private readonly notesGateway: NotesGateway,
    private readonly vaultsGateway: VaultsGateway,
  ) {}

  @Post()
  async executeBatch(
    @VaultId() vaultId,
    @NoteId() noteId,
    @Body() batchRequest: BatchRequestDto,
  ) {
    const changes = await this.batchService.executeBatch(noteId, batchRequest);

    this.notesGateway.emitEventToNote(
      noteId,
      NOTE_SOCKET_EVENTS.UPDATED_BATCH_NOTE,
      changes,
    );

    const index = changes.processedChanges.findIndex(
      (change) => change.type === 'noteInfo-Updated',
    );

    if (index !== -1) {
      this.vaultsGateway.emitEventToVault(vaultId, VAULT_EVENTS.VAULT_UPDATED, {
        updatedNote: changes.processedChanges[index].data,
        timeStamp: changes.timeStamp,
      });
    }

    return changes;
  }
}
