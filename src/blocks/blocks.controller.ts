import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoteAccessGuard } from 'src/notes/note-access.guard';
import { BlocksService } from './blocks.service';
import { NoteId } from 'src/notes/note.decorator';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { NotesGateway } from 'src/notes/notes.gateway';
import { NOTE_SOCKET_EVENTS } from 'src/notes/note-events.helper';
import { BATCH_EVENTS } from 'src/batch/batch-events.helpers';

@Controller('blocks')
@UseGuards(JwtAuthGuard, NoteAccessGuard)
@ApiTags('blocks')
@ApiBearerAuth()
@ApiHeader({
  name: 'vault_id',
  required: true,
})
@ApiHeader({
  name: 'note_id',
  required: true,
})
export class BlocksController {
  constructor(
    private readonly blocksService: BlocksService,
    private readonly notesGateway: NotesGateway,
  ) {}

  @Get()
  findAll(@NoteId() noteId: string) {
    return this.blocksService.findAll(noteId);
  }

  @Get(':blockId')
  findOne(@Param('blockId') blockId: string) {
    return this.blocksService.findOne(blockId);
  }

  @Post()
  async create(@NoteId() noteId, @Body() createBlockDto: CreateBlockDto) {
    const timeStamp = new Date().getTime();

    const createdBlock = await this.blocksService.create(
      noteId,
      createBlockDto,
    );

    this.notesGateway.emitEventToNote(
      noteId,
      NOTE_SOCKET_EVENTS.UPDATED_BATCH_NOTE,
      [
        {
          type: BATCH_EVENTS.NOTE_BLOCK_CREATED_BATCH,
          data: createdBlock,
          timeStamp,
        },
        timeStamp,
      ],
    );

    return createdBlock;
  }

  @Put(':blockId')
  async updateBlock(
    @NoteId() noteId,
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    const timeStamp = new Date().getTime();

    const updatedBlock = await this.blocksService.updateBlock(
      blockId,
      updateBlockDto,
    );

    this.notesGateway.emitEventToNote(
      noteId,
      NOTE_SOCKET_EVENTS.UPDATED_BATCH_NOTE,
      [
        {
          type: BATCH_EVENTS.NOTE_BLOCK_UPDATED_BATCH,
          data: updatedBlock,
          timeStamp: timeStamp,
        },
        timeStamp,
      ],
    );

    return updatedBlock;
  }

  @Delete(':blockId')
  async deleteBlock(@NoteId() noteId, @Param('blockId') blockId: string) {
    const timeStamp = new Date().getTime();

    await this.blocksService.delete(blockId);

    this.notesGateway.emitEventToNote(
      noteId,
      NOTE_SOCKET_EVENTS.UPDATED_BATCH_NOTE,
      [
        {
          type: BATCH_EVENTS.NOTE_BLOCK_DELETED_BATCH,
          data: blockId,
          timeStamp: timeStamp,
        },
        timeStamp,
      ],
    );

    return { message: 'Block deleted successfully', success: true };
  }
}
