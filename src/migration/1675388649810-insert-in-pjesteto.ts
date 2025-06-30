import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInPjesTeto1675388649810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO pjesteto("id", "imagem_url", "nomeverba", "codverba", "tetoof", "tetoprc", "mes", "ano") VALUES 
      (1, '/assets/images/dpo_logo.png', 'GOVERNO', 247, 2510, 19348, 6, 2025),
      (2, '/assets/images/pe_logo.png', 'PATRULHA ESCOLAR', 263, 190, 7000, 6, 2025),
      (3, '/assets/images/mobi_logo.png', 'CTM BRT', 255, 900, 4000, 6, 2025),
      (4, '/assets/images/alepe_logo.png', 'ALEPE', 251, 100, 400, 6, 2025),
      (5, '/assets/images/mppe_logo.jpg', 'MPPE', 253, 100, 400, 6, 2025),
      (6, '/assets/images/tjpe_logo.png', 'TJPE', 252, 100, 400, 6, 2025),
      (7, '/assets/images/camil_logo.jpg', 'CAMIL', 260, 100, 400, 6, 2025),
      (8, '/assets/images/brasil_logo.png', 'FEDERAL', 250, 100, 400, 6, 2025),
      (9, '/assets/images/sds_logo.png', 'OE', 999, 100, 400, 6, 2025),
      (10, '/assets/images/tce_logo.png', 'TCE', 266, 100, 400, 6, 2025),
      (11, '/assets/images/cprh_logo.jpg', 'CPRH', 257, 100, 400, 6, 2025),

      (12, '/assets/images/dpo_logo.png', 'GOVERNO', 247, 2510, 19348, 7, 2025),
      (13, '/assets/images/dpo_logo.png', 'PATRULHA ESCOLAR', 263, 190, 7000, 7, 2025),
      (14, '/assets/images/dpo_logo.png', 'CTM BRT', 255, 900, 4000, 7, 2025),
      (15, '/assets/images/dpo_logo.png', 'ALEPE', 251, 100, 400, 7, 2025),
      (16, '/assets/images/dpo_logo.png', 'MPPE', 253, 100, 400, 7, 2025),
      (17, '/assets/images/dpo_logo.png', 'TJPE', 252, 100, 400, 7, 2025),
      (18, '/assets/images/dpo_logo.png', 'CAMIL', 260, 100, 400, 7, 2025),
      (19, '/assets/images/dpo_logo.png', 'FEDERAL', 250, 100, 400, 7, 2025),
      (20, '/assets/images/dpo_logo.png', 'OE', 999, 100, 400, 7, 2025),
      (21, '/assets/images/dpo_logo.png', 'TCE', 266, 100, 400, 7, 2025),
      (22, '/assets/images/dpo_logo.png', 'CPRH', 257, 100, 400, 7, 2025),

      (23, '/assets/images/dpo_logo.png', 'GOVERNO', 247, 2510, 19348, 8, 2025),
      (24, '/assets/images/dpo_logo.png', 'PATRULHA ESCOLAR', 263, 190, 7000, 8, 2025),
      (25, '/assets/images/dpo_logo.png', 'CTM BRT', 255, 900, 4000, 8, 2025),
      (26, '/assets/images/dpo_logo.png', 'ALEPE', 251, 100, 400, 8, 2025),
      (27, '/assets/images/dpo_logo.png', 'MPPE', 253, 100, 400, 8, 2025),
      (28, '/assets/images/dpo_logo.png', 'TJPE', 252, 100, 400, 8, 2025),
      (29, '/assets/images/dpo_logo.png', 'CAMIL', 260, 100, 400, 8, 2025),
      (30, '/assets/images/dpo_logo.png', 'FEDERAL', 250, 100, 400, 8, 2025),
      (31, '/assets/images/dpo_logo.png', 'OE', 999, 100, 400, 8, 2025),
      (32, '/assets/images/dpo_logo.png', 'TCE', 266, 100, 400, 8, 2025),
      (33, '/assets/images/dpo_logo.png', 'CPRH', 257, 100, 400, 8, 2025);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public.pjesteto;
    `);
  }
}
