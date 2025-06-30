import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInDiretoria1675388649811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public."diretoria" (nomediretoria, dpoid)
      VALUES 
        ('DPO', 1),
        ('DIM', 1),
        ('DIRESP', 1),
        ('DINTER I', 1),
        ('DINTER II', 1),
        ('QCG', 1),
        ('OE', 1),
        ('DASDH', 1),
        ('MPPE', 1),
        ('TJPE', 1),
        ('CAMIL', 1),
        ('FEDERAL', 1),
        ('TIBRT', 1),
        ('TREPE', 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public."diretoria"
      WHERE nomediretoria IN (
        'DIM', 'DIRESP', 'DINTER I', 'DINTER II',
        'QCG', 'OE', 'DASDH', 'MPPE', 'TJPE', 'CAMIL', 'FEDERAL',
        'TIBRT', 'TREPE'
      );
    `);
  }
}
