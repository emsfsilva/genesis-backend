import { userEntityMock } from 'src/user/__mocks__/user.mock';
import { CreateSubcomDTO } from '../dtos/create-subcom.dto';

export const createSubcomMock: CreateSubcomDTO = {
  userId: userEntityMock.id,
};
