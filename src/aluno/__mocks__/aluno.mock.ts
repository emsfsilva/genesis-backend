import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { AlunoEntity } from '../entities/aluno.entity';

export const alunoMock: AlunoEntity = {
  id: 7435,
  userId: 1,
  resp1: 1,
  resp2: 1,
  grauInicial: 10,
  turmaId: turmaMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
