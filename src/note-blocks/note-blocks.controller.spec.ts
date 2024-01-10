import { Test, TestingModule } from '@nestjs/testing';
import { NoteBlocksController } from './note-blocks.controller';
import { NoteBlocksService } from './note-blocks.service';

describe('NoteBlocksController', () => {
  let controller: NoteBlocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteBlocksController],
      providers: [NoteBlocksService],
    }).compile();

    controller = module.get<NoteBlocksController>(NoteBlocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
