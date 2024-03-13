import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedPinAndTimeForUpdatedBlockNote1710331577540
  implements MigrationInterface
{
  name = 'UpdatedPinAndTimeForUpdatedBlockNote1710331577540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" RENAME COLUMN "pinned" TO "isPinned"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "note" RENAME COLUMN "isPinned" TO "pinned"`,
    );
  }
}
