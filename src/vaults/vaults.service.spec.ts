import { Test, TestingModule } from '@nestjs/testing';
import { VaultsService } from './vaults.service';

describe('VaultsService', () => {
  let service: VaultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaultsService],
    }).compile();

    service = module.get<VaultsService>(VaultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
