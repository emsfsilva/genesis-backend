import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablePjesTeto1675388649809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.pjesteto (
        id SERIAL PRIMARY KEY,
        imagem_url VARCHAR,
        nomeverba VARCHAR NOT NULL,
        codverba INTEGER NOT NULL,
        tetoof NUMERIC NOT NULL,
        tetoprc NUMERIC NOT NULL,
        mes INTEGER NOT NULL,
        ano INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.pjesteto;
    `);
  }
}
