import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablePjesOperacao1675770516770
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.pjesoperacao (
        id SERIAL PRIMARY KEY,

        nomeoperacao VARCHAR NOT NULL,
        pjeseventoid INTEGER NOT NULL,
        omeid INTEGER NOT NULL,

        ttctofdist INTEGER NOT NULL,
        ttctprcdist INTEGER NOT NULL,
        ttctofexe INTEGER NOT NULL,
        ttctprcexe INTEGER NOT NULL,

        userid INTEGER NOT NULL,
        statusevento VARCHAR NOT NULL,
        mes INTEGER NOT NULL,
        ano INTEGER NOT NULL,

        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      ALTER TABLE public.pjesoperacao
      ADD CONSTRAINT fk_pjesoperacao_pjeseventoid
      FOREIGN KEY (pjeseventoid)
      REFERENCES public.pjesevento(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.pjesoperacao;
    `);
  }
}
