import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { VaultAccessGuard } from 'src/vaults/vault-access.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VaultId } from 'src/vaults/vault.decorator';
import { UpdateNoteInfoDto } from './dto/update-note-info.dto';
import { NotesService } from './notes.service';
import { NotesGateway } from './notes.gateway';
import { NOTE_BATCH_EVENTS } from './note-events.helper';

@Controller('notes')
@UseGuards(JwtAuthGuard, VaultAccessGuard)
@ApiTags('notes')
@ApiBearerAuth()
@ApiHeader({
  name: 'vault_id',
  required: true,
})
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly notesGateway: NotesGateway,
  ) {}

  @Get()
  findAll(@VaultId() vaultId: string) {
    return this.notesService.findAll(vaultId);
  }

  @Get(':noteId')
  findOne(@Param('noteId') noteId: string) {
    return this.notesService.findOne(noteId);
  }

  @Post()
  async create(@VaultId() vaultId: string) {
    const createdNote = await this.notesService.create(vaultId);

    return createdNote;
  }

  @Put(':id/note-info')
  async updateTitle(
    @VaultId() vaultId: string,
    @Param('id') noteId: string,
    @Body() updatedNoteInfoDto: UpdateNoteInfoDto,
  ) {
    const timeStamp = new Date().getTime();

    const updatedNote = await this.notesService.updateNoteInfo(
      noteId,
      updatedNoteInfoDto,
    );

    this.notesGateway.emitEventToNote(
      noteId,
      NOTE_BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH,
      {
        batchChanges: [
          {
            type: NOTE_BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH,
            data: updatedNoteInfoDto,
            timeStamp: timeStamp,
          },
        ],
        timeStamp: timeStamp,
      },
    );

    return updatedNote;
  }

  @Delete(':id')
  async remove(@VaultId() vaultId: string, @Param('id') noteId: string) {
    await this.notesService.remove(noteId);

    return { id: noteId };
  }
}
