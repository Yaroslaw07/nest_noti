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
    { expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME! },
  );
  const refreshToken = jwtService.sign(
    { userId: user.id },
    { expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME! },
  );

  return { accessToken, refreshToken };
}
