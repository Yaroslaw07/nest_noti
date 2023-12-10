import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VaultsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string) {
    const existingVault = await this.prisma.vault.findFirst({
      where: {
        name: name,
        ownerId: userId,
      },
    });

    if (existingVault) {
      throw new ConflictException('Vault with this name already exists');
    }

    return this.prisma.vault.create({
      data: {
        name,
        owner: {
          connect: {
            id: userId,
          },
        },
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
      select: {
        id: true,
        name: true,
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
