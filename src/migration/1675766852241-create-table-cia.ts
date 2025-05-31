import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableCia1675766852241 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.cia (
                id integer NOT NULL,
                name character varying NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id)
            );
            
            CREATE SEQUENCE public.cia_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.cia_id_seq OWNED BY public.cia.id;
            
            ALTER TABLE ONLY public.cia ALTER COLUMN id SET DEFAULT nextval('public.cia_id_seq'::regclass);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table public.cia;
        `);
  }
}
