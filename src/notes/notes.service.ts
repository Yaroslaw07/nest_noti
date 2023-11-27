import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(vaultId: string) {
    console.log('vaultId', vaultId);
    return this.prisma.note.create({
      data: {
        title: 'Undefined',
        content: '',
        vault: {
          connect: {
            id: vaultId,
          },
        },
      },
    });
  }

  findAll(vaultId: string) {
    return this.prisma.note.findMany({
      where: {
        vaultId: vaultId,
      },
    });
  }

  findOne(noteId: string) {
    return this.prisma.note.findFirst({
      where: {
        id: noteId,
      },
    });
  }

  update(noteId: string, newTitle: string, newContent: string) {
    return this.prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: newTitle,
        content: newContent,
      },
    });
  }

  remove(noteId: string) {
    return this.prisma.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
