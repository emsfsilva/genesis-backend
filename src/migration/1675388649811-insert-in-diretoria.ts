import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInDiretoria1675388649811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public."diretoria"(nomediretoria)
      VALUES 
        ('DPO'),
        ('DIM'),
        ('DIRESP'),
        ('DINTER I'),
        ('DINTER II'),
        ('QCG'),
        ('OE');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public."diretoria"
      WHERE nomediretoria IN (
        'DPO', 'DIM', 'DIRESP', 'DINTER I', 'DINTER II',
        'QCG', 'OE'
      );
    `);
  }
}
