import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { VaultAccessGuard } from 'src/vaults/vault-access.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateNoteDto } from './dto/update-note.dto';
import { VaultId } from 'src/vaults/vault.decorator';
import { NotesGateway } from './notes.gateway';

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
  ) {}

  @Post()
  async create(@VaultId() vaultId: string) {
    const newNote = await this.notesService.create(vaultId);

    this.notesGateway.server.to(vaultId).emit('newNote', newNote.id);

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

  @Patch(':id')
  async update(
    @VaultId() vaultId: string,
    @Param('id') noteId: string,
    @Body() updateNote: UpdateNoteDto,
  ) {
    const { title, content, isTitleUpdated } = updateNote;

    const updatedNote = await this.notesService.update(noteId, title, content);

    this.notesGateway.server
      .to(vaultId)
      .emit('noteUpdated', { updatedNote, isTitleUpdated });

    return updatedNote;
  }

  @Patch(':id/title')
  async updateTitle(
    @VaultId() vaultId: string,
    @Param('id') noteId: string,
    @Body() newTitle: string,
  ) {
    const updatedNote = await this.notesService.updateTitle(noteId, newTitle);

    this.notesGateway.server
      .to(vaultId)
      .emit('noteUpdated', { updatedNote, isTitleUpdated: true });

    return updatedNote;
  }

  @Delete(':id')
  async remove(@VaultId() vaultId: string, @Param('id') noteId: string) {
    const result = await this.notesService.remove(noteId);

    this.notesGateway.server.to(vaultId).emit('noteDeleted', noteId);

    return result;
  }
}
