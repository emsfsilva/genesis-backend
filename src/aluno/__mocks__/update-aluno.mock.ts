import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { UpdateAlunoDTO } from '../dtos/update-aluno.dto';

export const updateAlunoMock: UpdateAlunoDTO = {
  userId: turmaMock.id,
  resp1: 1,
  resp2: 1,
  turmaId: turmaMock.id,
};
