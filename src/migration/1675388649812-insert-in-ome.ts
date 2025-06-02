import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInOme1675388649812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public."ome"(nomeOme, diretoriaid)
      VALUES 
        ('DPO', 1),
        ('1º BPM', 2),
        ('6º BPM', 2),
        ('11º BPM', 2),
        ('12º BPM', 2),
        ('13º BPM', 2),
        ('16º BPM', 2),
        ('17º BPM', 2),
        ('18º BPM', 2),
        ('19º BPM', 2),
        ('20º BPM', 2),
        ('25º BPM', 2),
        ('26º BPM', 2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public."ome"
      WHERE nomeOme IN (
        'DPO', '1º BPM', '6º BPM', '11º BPM', '12º BPM',
        '13º BPM', '16º BPM', '17º BPM', '18º BPM', '19º BPM',
        '20º BPM', '25º BPM', '26º BPM'
      );
    `);
  }
}
