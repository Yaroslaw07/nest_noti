import { CanActivate, Injectable } from '@nestjs/common';
import { VaultsService } from './vaults.service';

@Injectable()
export class VaultAccessGuard implements CanActivate {
  constructor(private readonly vaultsService: VaultsService) {}

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userIdFromJwt = request.user.id;
    const vaultIdFromRequest = request.headers?.vault_id;

    if (!vaultIdFromRequest) {
      return false;
    }
    const vault = await this.vaultsService.findOneWithOwner(vaultIdFromRequest);

    return vault && vault.owner.id === userIdFromJwt;
  }
}
