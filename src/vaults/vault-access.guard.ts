import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { VaultsService } from './vaults.service';

@Injectable()
export class VaultAccessGuard implements CanActivate {
  constructor(private readonly vaultsService: VaultsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userIdFromJwt = request.user.id;

    const vaultIdFromRequest = request.headers?.vault_id;

    if (!vaultIdFromRequest) {
      return false;
    }

    return this.vaultsService.checkOwnership(userIdFromJwt, vaultIdFromRequest);
  }
}
