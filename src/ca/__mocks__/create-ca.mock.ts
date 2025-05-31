import { userEntityMock } from 'src/user/__mocks__/user.mock';
import { CreateCaDTO } from '../dtos/create-ca.dto';

export const createCaMock: CreateCaDTO = {
  userId: userEntityMock.id,
};
