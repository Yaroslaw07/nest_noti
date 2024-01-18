import { Test, TestingModule } from '@nestjs/testing';
import { VaultsGateway } from './vaults.gateway';

describe('SocketGateway', () => {
  let gateway: VaultsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaultsGateway],
    }).compile();

    gateway = module.get<VaultsGateway>(VaultsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
