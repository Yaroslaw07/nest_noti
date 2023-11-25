import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 201, type: AuthEntity })
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  @ApiResponse({ status: 201, type: AuthEntity })
  async signup(@Body() { email, password, username }: SignupDto) {
    return this.authService.signup(email, password, username);
  }

  @Post('refresh')
  @ApiResponse({ status: 201, type: AuthEntity })
  async refresh(@Body() { refreshToken }: RefreshDto) {
    return this.authService.refresh(refreshToken);
  }
}
