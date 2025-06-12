import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablePjesDist1675770516767 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.pjesdist (
        id SERIAL PRIMARY KEY,
        nomedist VARCHAR NOT NULL,
        diretoriaid INTEGER NOT NULL,
        ttctofdist INTEGER NOT NULL,
        ttctprcdist INTEGER NOT NULL,
        userid INTEGER NOT NULL,
        statusdist VARCHAR NOT NULL,
        mes INTEGER NOT NULL,
        ano INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        CONSTRAINT fk_diretoria FOREIGN KEY (diretoriaid)
          REFERENCES public.diretoria(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_user FOREIGN KEY (userid)
          REFERENCES public."user"(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.pjesdist;
    `);
  }
}
