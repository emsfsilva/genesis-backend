import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertDadosSgp1675770516773 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public.dadossgp (
        matsgp, pgsgp, ngsgp, nomecompletosgp, omesgp, tiposgp,
        nunfuncsgp, nunvincsgp, localapresentacaosgp, situacaosgp, messgp, anosgp
      ) VALUES
        -- Junho 2025
        (1000001, 'Sd', 'ALMEIDA', 'João Almeida', '5', 'P', 1234, 1, 'SEDE DA OME', 'Regular', 6, 2025),
        (1000002, 'Cb', 'SOUZA', 'Carlos Souza', '10', 'P', 5678, 2, 'SEDE DA OME', 'Impedido', 6, 2025),
        (1000003, 'St', 'FERREIRA', 'Ana Ferreira', '8', 'P', 2345, 3, 'SEDE DA OME', 'Regular', 6, 2025),
        (1000004, '2º Ten', 'MARTINS', 'Marcos Martins', '12', 'O', 3456, 1, 'SEDE DA OME', 'Regular', 6, 2025),
        (1000005, 'Cap', 'ROCHA', 'Paula Rocha', '7', 'O', 6789, 2, 'SEDE DA OME', 'Impedido', 6, 2025),
        (1000006, 'Maj', 'LIMA', 'Bruno Lima', '9', 'O', 4567, 3, 'SEDE DA OME', 'Regular', 6, 2025),
        (1000007, 'Sd', 'SANTOS', 'Lucas Santos', '15', 'P', 1111, 1, 'SEDE DA OME', 'Regular', 6, 2025),
        (1000008, 'Cb', 'OLIVEIRA', 'Renata Oliveira', '16', 'P', 2222, 2, 'SEDE DA OME', 'Impedido', 6, 2025),
        (1000009, 'St', 'MORAES', 'Tiago Moraes', '14', 'P', 3333, 3, 'SEDE DA OME', 'Regular', 6, 2025),
        (1000010, '2º Ten', 'COSTA', 'Patrícia Costa', '13', 'O', 4444, 1, 'SEDE DA OME', 'Regular', 6, 2025),

        -- Julho 2025
        (1000011, 'Cap', 'NUNES', 'Rafael Nunes', '4', 'O', 5555, 2, 'SEDE DA OME', 'Impedido', 7, 2025),
        (1000012, 'Maj', 'TEIXEIRA', 'Camila Teixeira', '11', 'O', 6666, 3, 'SEDE DA OME', 'Regular', 7, 2025),
        (1000013, 'Sd', 'GOMES', 'Diego Gomes', '6', 'P', 7777, 1, 'SEDE DA OME', 'Regular', 7, 2025),
        (1000014, 'Cb', 'RIBEIRO', 'Lívia Ribeiro', '5', 'P', 8888, 2, 'SEDE DA OME', 'Impedido', 7, 2025),
        (1000015, 'St', 'BARROS', 'Felipe Barros', '17', 'P', 9999, 3, 'SEDE DA OME', 'Regular', 7, 2025),
        (1000016, '2º Ten', 'PEREIRA', 'Aline Pereira', '18', 'O', 1212, 1, 'SEDE DA OME', 'Regular', 7, 2025),
        (1000017, 'Cap', 'SILVA', 'Jorge Silva', '19', 'O', 1313, 2, 'SEDE DA OME', 'Regular', 7, 2025),
        (1000018, 'Maj', 'MENDES', 'Tatiane Mendes', '20', 'O', 1414, 3, 'SEDE DA OME', 'Impedido', 7, 2025),
        (1000019, 'Sd', 'CAMPOS', 'Igor Campos', '3', 'P', 1515, 1, 'SEDE DA OME', 'Regular', 7, 2025),
        (1000020, 'Cb', 'DIAS', 'Roberta Dias', '7', 'P', 1616, 2, 'SEDE DA OME', 'Regular', 7, 2025),

        -- Agosto 2025
        (1000021, 'St', 'BRITO', 'Fábio Brito', '3', 'P', 1717, 3, 'SEDE DA OME', 'Impedido', 8, 2025),
        (1000022, '2º Ten', 'ARAÚJO', 'Isabel Araújo', '5', 'O', 1818, 1, 'SEDE DA OME', 'Regular', 8, 2025),
        (1000023, 'Cap', 'TAVARES', 'Eduardo Tavares', '9', 'O', 1919, 2, 'SEDE DA OME', 'Regular', 8, 2025),
        (1000024, 'Maj', 'MEDEIROS', 'Vanessa Medeiros', '12', 'O', 2020, 3, 'SEDE DA OME', 'Regular', 8, 2025),
        (1000025, 'Sd', 'CARVALHO', 'Henrique Carvalho', '4', 'P', 2121, 1, 'SEDE DA OME', 'Impedido', 8, 2025),
        (1000026, 'Cb', 'PINTO', 'Bruna Pinto', '6', 'P', 2222, 2, 'SEDE DA OME', 'Regular', 8, 2025),
        (1000027, 'St', 'MACEDO', 'Rogério Macedo', '8', 'P', 2323, 3, 'SEDE DA OME', 'Regular', 8, 2025),
        (1000028, '2º Ten', 'FONSECA', 'Talita Fonseca', '10', 'O', 2424, 1, 'SEDE DA OME', 'Regular', 8, 2025),
        (1000029, 'Cap', 'MACHADO', 'Otávio Machado', '11', 'O', 2525, 2, 'SEDE DA OME', 'Impedido', 8, 2025),
        (1000030, 'Maj', 'REIS', 'Simone Reis', '13', 'O', 2626, 3, 'SEDE DA OME', 'Regular', 8, 2025);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public.dadossgp
      WHERE matsgp BETWEEN 1000001 AND 1000030;
    `);
  }
}
