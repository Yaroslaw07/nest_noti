import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VaultsModule } from './vaults/vaults.module';
import { ConfigModule } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    VaultsModule,
    NotesModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard, JwtStrategy],
})
export class AppModule {}
