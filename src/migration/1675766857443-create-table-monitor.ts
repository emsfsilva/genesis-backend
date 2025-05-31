import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableMonitor1675766857443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.monitor ( 
                id integer NOT NULL,
                user_id integer NOT NULL,
                cia_id integer NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id),
                foreign key (user_id) references public.user(id),
                foreign key (cia_id) references public.cia(id)
                
            );
            
            CREATE SEQUENCE public.monitor_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.monitor_id_seq OWNED BY public.monitor.id;
            
            ALTER TABLE ONLY public.monitor ALTER COLUMN id SET DEFAULT nextval('public.monitor_id_seq'::regclass);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table public.monitor;
        `);
  }
}
