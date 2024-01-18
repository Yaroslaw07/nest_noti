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
import { NotesService } from './notes.service';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { VaultAccessGuard } from 'src/vaults/vault-access.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateNoteDto } from './dto/update-note.dto';
import { VaultId } from 'src/vaults/vault.decorator';
import { NotesGateway } from './notes.gateway';
import { UpdateNoteTitleDto } from './dto/update-note-title.dto';
import { UpdateNoteBlockDto } from './dto/update-note-block.dto';
import { getNoteRoom, getVaultRoom } from 'src/helpers/socket-room';
import { VaultsGateway } from 'src/vaults/vaults.gateway';

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
    private notesGateway: NotesGateway,
    private vaultsGateway: VaultsGateway,
  ) {}

  @Post()
  async create(@VaultId() vaultId: string) {
    const newNote = await this.notesService.create(vaultId);

    console.log(getVaultRoom(vaultId));
    console.log(
      await this.notesGateway.server.in(getVaultRoom(vaultId)).fetchSockets(),
    );
    this.vaultsGateway.server.to(getVaultRoom(vaultId)).emit('noteListUpdated');
    return newNote;
  }

  @Get()
  findAll(@VaultId() vaultId: string) {
    return this.notesService.findAll(vaultId);
  }

  @Get(':id')
  findOne(@Param('id') noteId: string) {
    return this.notesService.findOne(noteId);
  }

  @Put(':id')
  async update(
    @VaultId() vaultId: string,
    @Param('id') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const { title, blocks, isTitleUpdated } = updateNoteDto;

    const updatedNote = await this.notesService.update(noteId, title, blocks);

    this.notesGateway.server
      .to(getNoteRoom(noteId))
      .emit('noteUpdated', { updatedNote });

    if (isTitleUpdated) {
      this.vaultsGateway.server
        .to(getVaultRoom(vaultId))
        .emit('noteListUpdated');
    }

    return updatedNote;
  }

  @Put(':id/title')
  async updateTitle(
    @VaultId() vaultId: string,
    @Param('id') noteId: string,
    @Body() updatedNoteTitleDto: UpdateNoteTitleDto,
  ) {
    const { title: newTitle } = updatedNoteTitleDto;

    const updatedNote = await this.notesService.updateTitle(noteId, newTitle);

    this.notesGateway.server.to(getNoteRoom(noteId)).emit('titleUpdated', {
      updatedNote: updatedNote,
    });
    this.vaultsGateway.server
      .to(getVaultRoom(vaultId))
      .emit('noteListUpdated', {
        isTitleUpdated: true,
      });

    return updatedNote;
  }

  @Put(':id/blocks')
  async updateBlocks(
    @VaultId() vaultId: string,
    @Param('id') noteId: string,
    @Body() updatedNoteBlocksDto: UpdateNoteBlockDto,
  ) {
    const { blocks } = updatedNoteBlocksDto;

    const updatedNote = await this.notesService.updateBlocks(noteId, blocks);

    this.notesGateway.server.to(getNoteRoom(noteId)).emit('blocksUpdated', {
      updatedNote: updatedNote,
      isTitleUpdated: false,
    });

    return updatedNote;
  }

  @Delete(':id')
  async remove(@VaultId() vaultId: string, @Param('id') noteId: string) {
    const result = await this.notesService.remove(noteId);

    this.vaultsGateway.server.to(getVaultRoom(vaultId)).emit('noteListUpdated');

    return result;
  }
}
