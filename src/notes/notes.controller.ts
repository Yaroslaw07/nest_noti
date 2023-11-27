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

@Controller('notes')
@UseGuards(JwtAuthGuard, VaultAccessGuard)
@ApiTags('notes')
@ApiBearerAuth()
@ApiHeader({
  name: 'vault_id',
  required: true,
})
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@VaultId() valueId: string) {
    return this.notesService.create(valueId);
  }

  @Get()
  findAll(@VaultId() valueId: string) {
    return this.notesService.findAll(valueId);
  }

  @Get(':id')
  findOne(@Param('id') noteId: string) {
    return this.notesService.findOne(noteId);
  }

  @Patch(':id')
  update(
    @Param('id') noteId: string,
    @Body() { title, content }: UpdateNoteDto,
  ) {
    return this.notesService.update(noteId, title, content);
  }

  @Delete(':id')
  remove(@Param('id') noteId: string) {
    return this.notesService.remove(noteId);
  }
}
