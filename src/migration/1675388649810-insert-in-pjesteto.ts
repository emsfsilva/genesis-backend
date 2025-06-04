import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInPjesTeto1675388649810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (1, 'PJES GOVERNO', 247, 50, 100, 6, 2025);
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (2, 'PJES PATRULHA ESCOLAR', 263, 20, 40, 6, 2025);
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (3, 'PJES CTM BRT', 255, 10, 20, 6, 2025);

        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (4, 'PJES GOVERNO', 247, 50, 100, 7, 2025);
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (5, 'PJES PATRULHA ESCOLAR', 263, 20, 40, 7, 2025);
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (6, 'PJES CTM BRT', 255, 10, 20, 7, 2025);

        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (7, 'PJES GOVERNO', 247, 50, 100, 8, 2025);
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (8, 'PJES PATRULHA ESCOLAR', 263, 20, 40, 8, 2025);
        INSERT INTO pjesteto("id", "nomeverba", "codverba" , "tetoof" , "tetoprc" , "mes" , "ano")
        VALUES (9, 'PJES CTM BRT', 255, 10, 20, 8, 2025);
     
      
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public.pjesteto;
    `);
  }
}
