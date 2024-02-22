import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1704718056600 implements MigrationInterface {
  name = 'Init1704718056600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "vaultId" uuid NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vault" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "ownerId" uuid NOT NULL, CONSTRAINT "PK_dd0898234c77f9d97585171ac59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_ae136031159ec99d434b4a6504e" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vault" ADD CONSTRAINT "FK_1020eb194bd34d668aca19244c7" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vault" DROP CONSTRAINT "FK_1020eb194bd34d668aca19244c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" DROP CONSTRAINT "FK_ae136031159ec99d434b4a6504e"`,
    );
    await queryRunner.query(`DROP TABLE "vault"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "note"`);
  }
}
