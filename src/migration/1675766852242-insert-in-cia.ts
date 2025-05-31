import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInCia1675766852242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO cia("id", "name") VALUES (1, 'Sem Cia');
            INSERT INTO cia("id", "name") VALUES (2, '1ª CIA');
            INSERT INTO cia("id", "name") VALUES (3, '2ª CIA');
            INSERT INTO cia("id", "name") VALUES (4, '3ª CIA');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public.cia;
        `);
  }
}
