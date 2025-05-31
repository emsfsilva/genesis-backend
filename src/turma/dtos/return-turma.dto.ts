import { ReturnCia } from 'src/cia/dtos/return-cia.dto';
import { TurmaEntity } from '../entities/turma.entity';
import { ReturnAlunoDTO } from 'src/aluno/dtos/return-aluno.dto';

export class ReturnTurma {
  id: number;
  name: string;
  cia?: ReturnCia;
  //aluno?: ReturnAlunoDTO;
  totalAlunos: number;

  constructor(turmaEntity: TurmaEntity) {
    this.id = turmaEntity.id;
    this.name = turmaEntity.name;
    this.cia = turmaEntity.cia ? new ReturnCia(turmaEntity.cia) : undefined;

    //this.aluno = turmaEntity.aluno
    //? new ReturnAlunoDTO(turmaEntity.aluno)
    // : undefined;

    this.totalAlunos = Array.isArray(turmaEntity.alunos)
      ? turmaEntity.alunos.length
      : 0;
  }
}
