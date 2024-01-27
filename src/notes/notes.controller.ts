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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateNoteDto } from './dto/update-note.dto';
import { VaultId } from 'src/vaults/vault.decorator';
import { UpdateNoteTitleDto } from './dto/update-note-title.dto';
import { UpdateNoteBlockDto } from './dto/update-note-block.dto';
import { VaultsService } from 'src/vaults/vaults.service';
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
    private readonly vaultsService: VaultsService,
  ) {}

  @Post()
  async create(@VaultId() vaultId: string) {
    const createdNote = await this.notesService.create(vaultId);

    await this.vaultsService.emitEventToVault(
      vaultId,
      'note-created',
      createdNote,
    );

    return createdNote;
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

    await this.notesService.emitEventToNote(noteId, 'note-updated', {
      updatedNote,
    });

    if (isTitleUpdated) {
      await this.vaultsService.emitEventToVault(
        vaultId,
        'noteInfos-updated',
        updatedNote,
      );
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

    await this.notesService.emitEventToNote(noteId, 'noteTitle-updated', {
      updatedNote: updatedNote,
    });

    await this.vaultsService.emitEventToVault(
      vaultId,
      'noteInfos-updated',
      updatedNote,
    );

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

    await this.notesService.emitEventToNote(noteId, 'noteBlocks-updated', {
      updatedNote: updatedNote,
    });

    return updatedNote;
  }

  @Delete(':id')
  async remove(@VaultId() vaultId: string, @Param('id') noteId: string) {
    await this.notesService.remove(noteId);

    await this.vaultsService.emitEventToVault(vaultId, 'note-deleted', noteId);

    return { id: noteId };
  }
}
