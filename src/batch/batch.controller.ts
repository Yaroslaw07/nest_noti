import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchRequestDto } from './dto/batch.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { NoteAccessGuard } from 'src/notes/note-access.guard';
import { NoteId } from 'src/notes/note.decorator';

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
  constructor(private readonly batchService: BatchService) {}

  @Post()
  async executeBatch(@NoteId() noteId, @Body() batchRequest: BatchRequestDto) {
    return this.batchService.executeBatch(noteId, batchRequest);
  }
}
