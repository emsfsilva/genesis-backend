import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablePjesEscala1675770516771 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.pjesescala (
        id SERIAL PRIMARY KEY,
        pjeseventoid INTEGER NOT NULL,
        pjesoperacaoid INTEGER NOT NULL,
        omeid INTEGER NOT NULL,
        pgsgp VARCHAR NOT NULL,
        matsgp INTEGER NOT NULL,
        ngsgp VARCHAR NOT NULL,
        nomecompletosgp VARCHAR NOT NULL,
        omesgp INTEGER NOT NULL,
        nunfuncsgp INTEGER NOT NULL,
        nunvincsgp INTEGER NOT NULL,
        situacaosgp VARCHAR NOT NULL,
        datainicio DATE NOT NULL,
        datafinal DATE NOT NULL,
        horainicio TIME NOT NULL,
        horafinal TIME NOT NULL,
        phone VARCHAR,
        localapresentacao VARCHAR,
        userid INTEGER NOT NULL,
        statusevento VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        
        CONSTRAINT fk_pjeseventoid FOREIGN KEY (pjeseventoid) REFERENCES public.pjesevento(id),
        CONSTRAINT fk_pjesoperacaoid FOREIGN KEY (pjesoperacaoid) REFERENCES public.pjesoperacao(id),
        CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES public."user"(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.pjesescala;
    `);
  }
}
