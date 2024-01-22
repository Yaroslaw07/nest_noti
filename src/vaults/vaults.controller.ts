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

@Controller('vaults')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @Post()
  async create(@AuthUser() user: JwtPayload, @Body() { name }: CreateVaultDto) {
    const vault = await this.vaultsService.create(user.id, name);
    await this.vaultsService.emitEventToVault('vault-created', vault.id, vault);
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
    await this.vaultsService.emitEventToVault('vault-updated', vault.id, vault);
    return vault;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vault = await this.vaultsService.remove(id);
    await this.vaultsService.emitEventToVault('vault-deleted', vault.id, vault);
    return vault;
  }
}
