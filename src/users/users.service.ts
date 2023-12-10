import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new ConflictException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, roundsOfHashing);

    return this.usersRepository.save({
      name: username,
      email: email,
      password: hashedPassword,
    });
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }
}
