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
        ('26º BPM', 2),
        ('1º BIESP', 3),
        ('2º BIESP', 3),
        ('3º BIESP', 3),
        ('BPCHOQUE', 3),
        ('BPGD', 3),
        ('BPRP', 3),
        ('BPRV', 3),
        ('BPTRAN', 3),
        ('CIATUR', 3),
        ('CIPCAES', 3),
        ('CIPMOTO', 3),
        ('CIPOMA', 3),
        ('RPMON', 3),
        ('2º BPM', 4),
        ('4º BPM', 4),
        ('9º BPM', 4),
        ('10º BPM', 4),
        ('15º BPM', 4),
        ('21º BPM', 4),
        ('22º BPM', 4),
        ('24º BPM', 4),
        ('27º BPM', 4),
        ('5ª CIPM', 4),
        ('6ª CIPM', 4),
        ('8ª CIPM', 4),
        ('10ª CIPM', 4),
        ('11ª CIPM', 4),
        ('3º BPM', 5),
        ('5º BPM', 5),
        ('7º BPM', 5),
        ('8º BPM', 5),
        ('14º BPM', 5),
        ('23º BPM', 5),
        ('1ª CIPM', 5),
        ('2ª CIPM', 5),
        ('4ª CIPM', 5),
        ('7ª CIPM', 5),
        ('9ª CIPM', 5),
        ('2ª EMG', 1),
        ('ADAGRO', 1),
        ('AG', 1),
        ('COPOM', 1),
        ('CREED', 1),
        ('CSMMB', 1),
        ('CPA_DPO', 1),
        ('CPO_DPO', 1),
        ('CSMMOTO', 1),
        ('DASIS', 1),
        ('DAS', 1),
        ('OLS', 1),
        ('SDS', 1),
        ('SEFAZ', 1),
        ('SMV_DPO', 1);
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
