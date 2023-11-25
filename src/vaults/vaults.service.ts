import { Injectable } from '@nestjs/common';
import { CreateVaultDto } from './dto/create-vault.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VaultsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createVaultDto: CreateVaultDto) {
    return this.prisma.vault.create({
      data: {
        ...createVaultDto,
        owner: { connect: { id: userId } },
      },
    });
  }

  findAll() {
    return `This action returns all vaults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vault`;
  }

  update(id: number, updateVaultDto: UpdateVaultDto) {
    return `This action updates a #${id} vault`;
  }

  remove(id: number) {
    return `This action removes a #${id} vault`;
  }
}
