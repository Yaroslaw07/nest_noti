import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlocksAndPin1708638449469 implements MigrationInterface {
  name = 'BlocksAndPin1708638449469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" DROP CONSTRAINT "FK_ae136031159ec99d434b4a6504e"`,
    );
    await queryRunner.query(
      `CREATE TABLE "block" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "type" text NOT NULL DEFAULT 'text', "props" jsonb NOT NULL DEFAULT '{"text":""}', "noteId" uuid, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "note" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" ADD "pinned" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "block" ADD CONSTRAINT "FK_812cee8d54b3fa594d5ea7ba716" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_ae136031159ec99d434b4a6504e" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" DROP CONSTRAINT "FK_ae136031159ec99d434b4a6504e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block" DROP CONSTRAINT "FK_812cee8d54b3fa594d5ea7ba716"`,
    );
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "pinned"`);
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "note" ADD "content" text NOT NULL`);
    await queryRunner.query(`DROP TABLE "block"`);
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_ae136031159ec99d434b4a6504e" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
