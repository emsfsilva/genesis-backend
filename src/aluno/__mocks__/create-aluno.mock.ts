import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { CreateAlunoDTO } from '../dtos/create-aluno.dto';

export const createAlunoMock: CreateAlunoDTO = {
  userId: turmaMock.id,
  resp1: 1,
  resp2: 1,
  grauInicial: 10,
  turmaId: turmaMock.id,
};
