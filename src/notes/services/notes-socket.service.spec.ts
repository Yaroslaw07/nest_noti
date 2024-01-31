import { Test, TestingModule } from '@nestjs/testing';
import { NotesSocketService } from './notes-socket.service';

describe('NotesService', () => {
  let service: NotesSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesSocketService],
    }).compile();

    service = module.get<NotesSocketService>(NotesSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
