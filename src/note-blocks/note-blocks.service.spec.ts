import { Test, TestingModule } from '@nestjs/testing';
import { NoteBlocksService } from './note-blocks.service';

describe('NoteBlocksService', () => {
  let service: NoteBlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteBlocksService],
    }).compile();

    service = module.get<NoteBlocksService>(NoteBlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
