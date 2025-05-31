export class AlunoTurmaTotalDTO {
  totalTurmas: number;
  totalAlunos: number;
  totalAlunosSemTurma: number;

  constructor(
    totalTurmas: number,
    totalAlunos: number,
    totalAlunosSemTurma: number,
  ) {
    this.totalTurmas = totalTurmas;
    this.totalAlunos = totalAlunos;
    this.totalAlunosSemTurma = totalAlunosSemTurma;
  }
}
