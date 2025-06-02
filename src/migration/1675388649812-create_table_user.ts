import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableUser1675388649812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.user (
        id integer NOT NULL,
        email character varying NOT NULL,
        password character varying NOT NULL,
        pg character varying NOT NULL,
        mat integer NOT NULL,
        ng character varying NOT NULL,
        omeid integer NOT NULL,
        phone character varying NOT NULL,
        funcao character varying NOT NULL,
        type_user int NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        PRIMARY KEY (id)
      );

      CREATE SEQUENCE public.user_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

      ALTER SEQUENCE public.user_id_seq OWNED BY public.user.id;

      ALTER TABLE ONLY public.user
        ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);

      ALTER TABLE public.user
        ADD CONSTRAINT fk_user_ome
        FOREIGN KEY (omeid)
        REFERENCES public.ome(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.user;
      DROP SEQUENCE public.user_id_seq;
    `);
  }
}
