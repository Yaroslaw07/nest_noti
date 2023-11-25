import { IsNotEmpty, IsString } from 'class-validator';

export class JwtPayload {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  isRegistered: boolean;
}
