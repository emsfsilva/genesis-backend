import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInTurma1675766852243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO turma("id", "name", "cia_id") VALUES (1, 'Sem Turma', 1);

            INSERT INTO turma("id", "name", "cia_id") VALUES (2, 'A1', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (3, 'A2', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (4, 'A3', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (5, 'A4', 2);
            
            INSERT INTO turma("id", "name", "cia_id") VALUES (5, 'B1', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (6, 'B2', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (7, 'B3', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (8, 'B4', 2);
            
            INSERT INTO turma("id", "name", "cia_id") VALUES (9, 'C1', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (10, 'C2', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (11, 'C3', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (12, 'C4', 3);
            
            INSERT INTO turma("id", "name", "cia_id") VALUES (13, 'D1', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (14, 'D2', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (15, 'D3', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (16, 'D4', 3);
            
            INSERT INTO turma("id", "name", "cia_id") VALUES (17, 'E1', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (18, 'E2', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (19, 'E3', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (20, 'E4', 4);
            
            INSERT INTO turma("id", "name", "cia_id") VALUES (21, 'F1', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (22, 'F2', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (23, 'F3', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (24, 'F4', 4);
            
            INSERT INTO turma("id", "name", "cia_id") VALUES (25, 'G1', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (26, 'G2', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (27, 'G3', 4);
            INSERT INTO turma("id", "name", "cia_id") VALUES (28, 'G4', 4);
            
            
            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public.turma;
        `);
  }
}
