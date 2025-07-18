import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInOme1675388649812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public."ome"(nomeOme, diretoriaid)
      VALUES 
        ('DPO SEDE', 1),
        ('DIM SEDE', 2),
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
        ('DIRESP SEDE', 3),
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
        ('DINTER I SEDE', 4),
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
        ('DINTER II SEDE', 5),
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
        ('SMV_DPO', 1),
        ('DASDH SEDE', 8),
        ('MPPE SEDE', 9),
        ('TJPE SEDE', 10),
        ('CAMIL SEDE', 11);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM public."ome"
    WHERE nomeOme IN (
      'DPO SEDE', 'DIM SEDE', '1º BPM', '6º BPM', '11º BPM', '12º BPM', '13º BPM',
      '16º BPM', '17º BPM', '18º BPM', '19º BPM', '20º BPM', '25º BPM', '26º BPM',
      'DIRESP SEDE', '1º BIESP', '2º BIESP', '3º BIESP', 'BPCHOQUE', 'BPGD',
      'BPRP', 'BPRV', 'BPTRAN', 'CIATUR', 'CIPCAES', 'CIPMOTO', 'CIPOMA', 'RPMON',
      'DINTER I SEDE', '2º BPM', '4º BPM', '9º BPM', '10º BPM', '15º BPM',
      '21º BPM', '22º BPM', '24º BPM', '27º BPM', '5ª CIPM', '6ª CIPM',
      '8ª CIPM', '10ª CIPM', '11ª CIPM', 'DINTER II SEDE', '3º BPM', '5º BPM',
      '7º BPM', '8º BPM', '14º BPM', '23º BPM', '1ª CIPM', '2ª CIPM',
      '4ª CIPM', '7ª CIPM', '9ª CIPM', '2ª EMG', 'ADAGRO', 'AG', 'COPOM',
      'CREED', 'CSMMB', 'CPA_DPO', 'CPO_DPO', 'CSMMOTO', 'DASIS', 'DAS',
      'OLS', 'SDS', 'SEFAZ', 'SMV_DPO'
    );
  `);
  }
}
