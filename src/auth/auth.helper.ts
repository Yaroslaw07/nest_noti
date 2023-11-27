import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload';
import { User } from '@prisma/client';

export function generateTokens(
  jwtService: JwtService,
  user: User,
): { accessToken: string; refreshToken: string } {
  const userAsJwtPayload: JwtPayload = {
    id: user.id,
  };

  const accessToken = jwtService.sign(
    { ...userAsJwtPayload },
    { expiresIn: '15min' },
  );
  const refreshToken = jwtService.sign(
    { userId: user.id },
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
}
