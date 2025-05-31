import { ReturnTurma } from 'src/turma/dtos/return-turma.dto';
import { AlunoEntity } from '../entities/aluno.entity';
import { ReturnUserDto } from 'src/user/dtos/returnUser.dto';

export class ReturnAlunoDTO {
  id: number;
  userId: number;
  resp1: number;
  resp2: number;
  grauInicial: number;
  grauAtual?: number;
  turmaId: number;
  turma?: ReturnTurma;
  user?: ReturnUserDto;

  responsavel1?: ReturnUserDto;
  responsavel2?: ReturnUserDto;

  constructor(alunoEntity: AlunoEntity, grauAtual?: number) {
    this.id = alunoEntity.id;
    this.userId = alunoEntity.userId;
    this.resp1 = alunoEntity.resp1;
    this.resp2 = alunoEntity.resp2;
    this.grauInicial = alunoEntity.grauInicial;
    this.grauAtual = grauAtual ?? (alunoEntity as any).grauAtual;
    this.turmaId = alunoEntity.turmaId;

    this.turma = alunoEntity.turma
      ? new ReturnTurma(alunoEntity.turma)
      : undefined;

    // Mapear o usuário associado ao aluno
    this.user = alunoEntity.user
      ? new ReturnUserDto(alunoEntity.user)
      : undefined;

    this.responsavel1 = alunoEntity.responsavel1
      ? new ReturnUserDto(alunoEntity.responsavel1)
      : undefined;

    this.responsavel2 = alunoEntity.responsavel2
      ? new ReturnUserDto(alunoEntity.responsavel2)
      : undefined;
  }
}
