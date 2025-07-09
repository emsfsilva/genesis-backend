import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertRootInUser1675770516768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO public."user"(
                "id", "imagem_url", "loginsei", "email", "pg", "mat", "ng", "tipo", "omeid", "phone", "funcao", "type_user", "password") VALUES
                (1,'/assets/images/1157590.png','emerson.francisco1','ems.fsilva.pe@gmail.com', 'Cb', 1157590, 'Francisco', 'P', 1, '(81)98685-4814', 'Master', 10, '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.'),
                (2,'/assets/images/9601902.png','julio.americo','julio@gmail.com', 'Tc', 9601902, 'Julio', 'O', 2, '(81)98685-4814', 'Diretor', 3, '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.'),
                (3,'/assets/images/1085328.png','emerson.fabio','fabio@gmail.com', '3º Sgt', 1085348, 'Fabio', 'P', 10, '(81)98685-4814', 'Comum', 2, '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.'),
                (4,'/assets/images/1078747.png','bruno.daniel','daniel@gmail.com', '1º Sgt', 1078790, 'Daniel', 'P', 12, '(81)98685-4814', 'Auxiliar', 1, '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public."user"
                WHERE loginsei like 'emerson.francisco1';
        `);
  }
}
