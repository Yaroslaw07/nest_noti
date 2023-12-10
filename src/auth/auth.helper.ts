import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload';
import { User } from '../users/entities/user.entity';

export function generateTokens(
  jwtService: JwtService,
  user: User,
): { accessToken: string; refreshToken: string } {
  const userAsJwtPayload: JwtPayload = {
    id: user.id,
  };

  const accessToken = jwtService.sign(
    { ...userAsJwtPayload },
    { expiresIn: '15m' },
  );
  const refreshToken = jwtService.sign(
    { userId: user.id },
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
}
