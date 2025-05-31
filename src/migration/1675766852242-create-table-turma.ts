import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableTurma1675766852242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.turma (
                id integer NOT NULL,
                cia_id integer NOT NULL,
                name character varying NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id),
                foreign key (cia_id) references public.cia(id)
            );
            
            CREATE SEQUENCE public.turma_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.turma_id_seq OWNED BY public.turma.id;
            
            ALTER TABLE ONLY public.turma ALTER COLUMN id SET DEFAULT nextval('public.turma_id_seq'::regclass);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table public.turma;
        `);
  }
}
