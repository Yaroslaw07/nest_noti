import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { VaultsService } from 'src/vaults/vaults.service';
import { NotesService } from './services/notes.service';

@Injectable()
export class NoteAccessGuard implements CanActivate {
  constructor(
    private readonly vaultsService: VaultsService,
    private readonly notesService: NotesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromJwt = request.user.id;
    const noteIdFromRequest = request.headers?.note_id;

    if (!noteIdFromRequest) {
      return false;
    }

    const note = await this.notesService.findOneWithVault(noteIdFromRequest);

    if (!note || !note.vault.id) {
      return false;
    }

    const hasVaultAccess = await this.vaultsService.checkOwnership(
      userIdFromJwt,
      note.vault.id,
    );

    return hasVaultAccess;
  }
}
