import { Test, TestingModule } from '@nestjs/testing';
import { NotesGateway } from './notes.gateway';

describe('SocketGateway', () => {
  let gateway: NotesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesGateway],
    }).compile();

    gateway = module.get<NotesGateway>(NotesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
