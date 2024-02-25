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
  constructor(private readonly blocksService: BlocksService) {}

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
    const createdBlock = await this.blocksService.create(
      noteId,
      createBlockDto,
    );

    return createdBlock;
  }

  @Put(':blockId')
  async updateBlock(
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    const updatedBlock = await this.blocksService.updateBlock(
      blockId,
      updateBlockDto,
    );

    return updatedBlock;
  }

  @Delete(':blockId')
  async deleteBlock(@NoteId() noteId, @Param('blockId') blockId: string) {
    await this.blocksService.delete(blockId);

    return { message: 'Block deleted successfully', success: true };
  }
}
