import { CanActivate, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VaultAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userIdFromJwt = request.user.id;
    const vaultIdFromRequest = request.headers?.vault_id;

    console.log('vault', vaultIdFromRequest);

    if (!vaultIdFromRequest) {
      return false;
    }

    const vault = await this.prisma.vault.findUnique({
      where: {
        id: vaultIdFromRequest,
      },
    });

    return vault && vault.ownerId === userIdFromJwt;
  }
}
