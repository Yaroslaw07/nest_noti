import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { VaultsModule } from 'src/vaults/vaults.module';
import { NotesGateway } from './notes.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [NotesController],
  imports: [
    TypeOrmModule.forFeature([Note]),
    AuthModule,
    VaultsModule,
    UsersModule,
  ],
  providers: [NotesService, NotesGateway],
})
export class NotesModule {}
