import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VaultAccessGuard } from 'src/vaults/vault-access.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VaultId } from 'src/vaults/vault.decorator';
import { UpdateNoteInfoDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';
import { NotesGateway } from './notes.gateway';
import { BATCH_EVENTS } from 'src/batch/batch-events.helpers';
import { VaultsGateway } from 'src/vaults/vaults.gateway';
import { NOTE_INFOS_SOCKET_EVENTS } from './note-events.helper';
import { CreateNoteDto } from './dto/create-note.dto';

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
    private readonly vaultsGateway: VaultsGateway,
  ) {}

  @ApiQuery({
    name: 'title',
    required: false,
    type: null,
  })
  @ApiQuery({
    name: 'isPinned',
    required: false,
    type: '',
  })
  @Get()
  findAll(@VaultId() vaultId: string, @Query() query) {
    return this.notesService.findAll(vaultId, query);
  }

  @Get(':id')
  findOne(@Param('id') noteId: string) {
    return this.notesService.findOne(noteId);
  }

  @Post()
  async create(
    @VaultId() vaultId: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const timeStamp = new Date().getTime();
    const createdNote = await this.notesService.create(vaultId, createNoteDto);

    this.vaultsGateway.emitEventToVault(
      vaultId,
      NOTE_INFOS_SOCKET_EVENTS.NOTE_CREATED,
      {
        createdNote,
        timeStamp,
      },
    );

    return createdNote;
  }

  @Put(':id')
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
      BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH,
      {
        batchChanges: [
          {
            type: BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH,
            data: updatedNoteInfoDto,
            timeStamp: timeStamp,
          },
        ],
        timeStamp: timeStamp,
      },
    );

    this.vaultsGateway.emitEventToVault(
      vaultId,
      NOTE_INFOS_SOCKET_EVENTS.NOTE_INFOS_UPDATED,
      {
        updatedNote,
        timeStamp,
      },
    );

    return updatedNote;
  }

  @Delete(':id')
  async remove(@VaultId() vaultId: string, @Param('id') noteId: string) {
    const timeStamp = new Date().getTime();

    await this.notesService.remove(noteId);

    this.vaultsGateway.emitEventToVault(
      vaultId,
      NOTE_INFOS_SOCKET_EVENTS.NOTE_DELETED,
      {
        deletedNoteId: noteId,
        timeStamp,
      },
    );

    return { id: noteId };
  }
}
