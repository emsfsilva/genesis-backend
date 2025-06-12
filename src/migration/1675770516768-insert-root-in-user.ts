import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertRootInUser1675770516768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO public."user"(
                loginsei, email, pg, mat, ng, tipo, omeid, phone, funcao, type_user, password)
                VALUES ('emerson.francisco1','ems.fsilva.pe@gmail.com', 'Cb', 1157590, 'Francisco', 'P', 1, '(81)98685-4814', 'Master', 10, '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public."user"
                WHERE loginsei like 'emerson.francisco1';
        `);
  }
}
