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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { VaultsGateway } from './vaults.gateway';
import { getVaultRoom } from 'src/helpers/socket-room';

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

    this.vaultsGateway.server
      .to(getVaultRoom(vault.id))
      .emit('vault-created', vault);

    return vault;
  }

  @Get()
  findAll(@AuthUser() user: JwtPayload) {
    return this.vaultsService.findAll(user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVaultDto: UpdateVaultDto,
  ) {
    const vault = await this.vaultsService.update(id, updateVaultDto);

    this.vaultsGateway.server
      .to(getVaultRoom(vault.id))
      .emit('vaultCreated', vault);

    return this.vaultsService.update(id, updateVaultDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vault = await this.vaultsService.remove(id);

    this.vaultsGateway.server
      .to(getVaultRoom(vault.id))
      .emit('vaultDeleted', vault);

    return vault;
  }
}
