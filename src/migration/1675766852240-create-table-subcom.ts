import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableSubcom1675766852240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.subcom ( 
                id integer NOT NULL,
                user_id integer NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id),
                foreign key (user_id) references public.user(id)
                
            );
            
            CREATE SEQUENCE public.subcom_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.subcom_id_seq OWNED BY public.subcom.id;
            
            ALTER TABLE ONLY public.subcom ALTER COLUMN id SET DEFAULT nextval('public.subcom_id_seq'::regclass);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table public.subcom;
        `);
  }
}
