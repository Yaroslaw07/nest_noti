import { Controller } from '@nestjs/common';
import { NoteBlocksService } from './note-blocks.service';

@Controller('note-blocks')
export class NoteBlocksController {
  constructor(private readonly noteBlocksService: NoteBlocksService) {}
}
