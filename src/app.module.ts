import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VaultsModule } from './vaults/vaults.module';
import { ConfigModule } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    VaultsModule,
    ConfigModule.forRoot(),
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard, JwtStrategy],
})
export class AppModule {}
