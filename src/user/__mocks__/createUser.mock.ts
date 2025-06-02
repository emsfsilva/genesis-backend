import { CreateUserDto } from '../dtos/createUser.dto';
import { UserType } from '../enum/user-type.enum';

export const createUserMock: CreateUserDto = {
  email: 'emailMockTest@email.com',
  password: 'password',
  pg: 'Cb',
  mat: 1157590,
  nomeGuerra: 'Francisco',
  omeId: 1,
  phone: '325632634',
  funcao: 'Master',
  typeUser: UserType.Master,
};
