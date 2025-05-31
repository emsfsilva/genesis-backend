import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableAluno1675766857443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.aluno ( 
                id integer NOT NULL,
                user_id integer NOT NULL,
                resp1 integer,
                resp2 integer,
                grau_inicial float NOT NULL,
                turma_id integer,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id),
                foreign key (user_id) references public.user(id),
                FOREIGN KEY (resp1) REFERENCES public.user(id),
                FOREIGN KEY (resp2) REFERENCES public.user(id),
                foreign key (turma_id) references public.turma(id)
            );
            
            CREATE SEQUENCE public.aluno_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.aluno_id_seq OWNED BY public.aluno.id;
            
            ALTER TABLE ONLY public.aluno ALTER COLUMN id SET DEFAULT nextval('public.aluno_id_seq'::regclass);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table public.aluno;
        `);
  }
}
