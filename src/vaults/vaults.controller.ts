import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { AuthUser } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { VaultsGateway } from './vaults.gateway';
import { VAULT_EVENTS } from './vault-events.helper';

@Controller('vaults')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('vaults')
export class VaultsController {
  constructor(
    private readonly vaultsService: VaultsService,
    private readonly vaultsGateway: VaultsGateway,
  ) {}

  @Post()
  async create(@AuthUser() user: JwtPayload, @Body() { name }: CreateVaultDto) {
    const vault = await this.vaultsService.create(user.id, name);
    await this.vaultsGateway.emitEventToVault(
      vault.id,
      VAULT_EVENTS.VAULT_CREATED,
      vault,
    );
    return vault;
  }

  @Get()
  findAll(@AuthUser() user: JwtPayload) {
    return this.vaultsService.findAll(user.id);
  }

  @Get(':vaultId')
  findOne(@Param('vaultId') vaultId: string) {
    return this.vaultsService.findOneWithOwner(vaultId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVaultDto: UpdateVaultDto,
  ) {
    const vault = await this.vaultsService.update(id, updateVaultDto);

    await this.vaultsGateway.emitEventToVault(
      vault.id,
      VAULT_EVENTS.VAULT_UPDATED,
      vault,
    );

    return vault;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vault = await this.vaultsService.remove(id);

    await this.vaultsGateway.emitEventToVault(
      id,
      VAULT_EVENTS.VAULT_DELETED,
      null,
    );

    return vault;
  }
}
