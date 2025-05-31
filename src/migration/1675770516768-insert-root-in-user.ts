import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertRootInUser1675770516768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO public."user"(
                name, email, cpf, orgao, pg, mat, ng, funcao, type_user, phone, password)
                VALUES ('Emerson Francisco da Silva', 'ems.fsilva.pe@gmail.com', '08286667417','PMPE', 'Cb', 1157590, 'Francisco', 'Master', 10, '(81)98685-4814', '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public."user"
                WHERE email like 'ems.fsilva.pe@gmail.com';
        `);
  }
}
