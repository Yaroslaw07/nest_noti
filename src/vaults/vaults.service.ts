import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vault } from './entities/vault.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VaultsService {
  constructor(
    @InjectRepository(Vault)
    private vaultsRepository: Repository<Vault>,
  ) {}

  async create(userId: string, name: string) {
    const existingVault = await this.vaultsRepository.findOne({
      where: {
        name: name,
        owner: {
          id: userId,
        },
      },
    });

    if (existingVault) {
      throw new ConflictException('Vault with this name already exists');
    }

    return this.vaultsRepository.save({
      name,
      owner: {
        id: userId,
      },
    });
  }

  findOne(id: string) {
    return this.vaultsRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  findOneWithOwner(id: string) {
    return this.vaultsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner'],
    });
  }

  findAll(userId: string) {
    return this.vaultsRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      select: ['id', 'name'],
    });
  }

  async update(id: string, updateVaultDto: UpdateVaultDto) {
    const existingVault = await this.vaultsRepository.findOne({
      where: { id: id },
    });

    if (!existingVault) {
      throw new ConflictException('Vault does not exist');
    }

    return this.vaultsRepository.save({
      ...existingVault,
      ...updateVaultDto,
    });
  }

  async remove(id: string) {
    const existingVault = await this.vaultsRepository.findOne({
      where: { id: id },
    });

    if (!existingVault) {
      throw new ConflictException('Vault does not exist');
    }

    return this.vaultsRepository.remove(existingVault);
  }
}
