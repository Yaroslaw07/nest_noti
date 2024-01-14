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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NoteAccessGuard } from 'src/notes/note-access.guard';
import { NotesGateway } from 'src/notes/notes.gateway';
import { BlocksService } from './blocks.service';
import { NoteId } from 'src/notes/note.decorator';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

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
    private notesGateway: NotesGateway,
  ) {}

  @Get()
  findAll(@NoteId() noteId: string) {
    return this.blocksService.findAll(noteId);
  }

  @Post()
  async create(@NoteId() noteId, @Body() createBlockDto: CreateBlockDto) {
    const newBlock = await this.blocksService.create(
      noteId,
      createBlockDto.order,
    );

    return newBlock;
  }

  @Put(':blockId')
  async updateBlock(
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    const { type, props } = updateBlockDto;
    return this.blocksService.updateBlock(blockId, type, props);
  }

  // @Patch(':blockId/move/:newOrder')
  // async moveBlockToPosition(
  //   @Param('blockId') blockId: string,
  //   @Param('newOrder') newOrder: number,
  // ) {
  //   await this.blocksService.moveBlockToPosition(blockId, newOrder);
  // }

  @Delete(':blockId')
  async deleteBlock(@Param('blockId') blockId: string) {
    await this.blocksService.deleteBlock(blockId);
  }
}
