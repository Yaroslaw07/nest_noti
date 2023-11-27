import { Injectable } from '@nestjs/common';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VaultsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string) {
    return this.prisma.vault.create({
      data: {
        name: name,
        owner: { connect: { id: userId } },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.vault.findMany({
      where: {
        owner: {
          id: userId,
        },
      },
    });
  }

  update(id: string, updateVaultDto: UpdateVaultDto) {
    return this.prisma.vault.update({
      where: {
        id: id,
      },
      data: updateVaultDto,
    });
  }

  remove(id: string) {
    return this.prisma.vault.delete({
      where: {
        id: id,
      },
    });
  }
}
