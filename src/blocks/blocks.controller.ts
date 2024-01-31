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

  @Post()
  async create(@NoteId() noteId, @Body() createBlockDto: CreateBlockDto) {
    const createdBlock = await this.blocksService.create(
      noteId,
      createBlockDto.order,
    );

    await this.notesGateway.emitEventToNote(
      noteId,
      'block-created',
      createdBlock,
    );

    return createdBlock;
  }

  @Put(':blockId')
  async updateBlock(
    @NoteId() noteId: string,
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    const { type, props } = updateBlockDto;

    const updatedBlock = await this.blocksService.updateBlock(
      blockId,
      type,
      props,
    );

    this.notesGateway.emitEventToNote(noteId, 'block-updated', updatedBlock);

    return updatedBlock;
  }

  // @Patch(':blockId/move/:newOrder')
  // async moveBlockToPosition(
  //   @Param('blockId') blockId: string,
  //   @Param('newOrder') newOrder: number,
  // ) {
  //   await this.blocksService.moveBlockToPosition(blockId, newOrder);
  // }

  @Delete(':blockId')
  async deleteBlock(@NoteId() noteId, @Param('blockId') blockId: string) {
    const deletedBlock = await this.blocksService.deleteBlock(blockId);

    await this.notesGateway.emitEventToNote(
      noteId,
      'block-deleted',
      deletedBlock,
    );

    return deletedBlock;
  }
}
