import { Test, TestingModule } from '@nestjs/testing';
import { VaultsController } from './VaultsController';
import { VaultsService } from './vaults.service';

describe('VaultsController', () => {
  let controller: VaultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaultsController],
      providers: [VaultsService],
    }).compile();

    controller = module.get<VaultsController>(VaultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
