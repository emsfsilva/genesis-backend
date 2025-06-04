import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablePjesEvento1675770516769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.pjesevento (
        id SERIAL PRIMARY KEY,
        nomeevento VARCHAR NOT NULL,
        omeid INTEGER NOT NULL,
        ttctof INTEGER NOT NULL,
        ttctprc INTEGER NOT NULL,
        userid INTEGER NOT NULL,
        statusevento VARCHAR NOT NULL,
        mes INTEGER NOT NULL,
        ano INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      ALTER TABLE public.pjesevento
        ADD CONSTRAINT fk_pjesevento_ome FOREIGN KEY (omeid) REFERENCES public.ome(id),
        ADD CONSTRAINT fk_pjesevento_user FOREIGN KEY (userid) REFERENCES public.user(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.pjesevento;
    `);
  }
}
