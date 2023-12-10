import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(username: string, email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new ConflictException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, roundsOfHashing);

    return this.prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}