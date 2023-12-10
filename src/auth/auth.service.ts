import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { generateTokens } from './auth.helper';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email, password): Promise<AuthEntity> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('No user found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return generateTokens(this.jwtService, user);
  }

  async signup(
    email: string,
    password: string,
    username: string,
  ): Promise<AuthEntity> {
    const user = await this.usersService.create(username, email, password);

    return generateTokens(this.jwtService, user);
  }

  async refresh(refreshToken: string): Promise<AuthEntity> {
    const { userId } = this.jwtService.verify(refreshToken);

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`No user found for id: ${userId}`);
    }

    return generateTokens(this.jwtService, user);
  }
}
