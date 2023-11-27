import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { AuthUser } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateVaultDto } from './dto/update-vault.dto';

@Controller('vaults')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @Post()
  create(@AuthUser() user: JwtPayload, @Body() { name }: CreateVaultDto) {
    return this.vaultsService.create(user.id, name);
  }

  @Get()
  findAll(@AuthUser() user: JwtPayload) {
    return this.vaultsService.findAll(user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVaultDto: UpdateVaultDto) {
    return this.vaultsService.update(id, updateVaultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaultsService.remove(id);
  }
}
