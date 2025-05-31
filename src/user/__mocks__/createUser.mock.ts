import { CreateUserDto } from '../dtos/createUser.dto';
import { UserType } from '../enum/user-type.enum';

export const createUserMock: CreateUserDto = {
  cpf: '3214215151',
  orgao: 'PMPE',
  pg: 'Cb',
  mat: 1157590,
  nomeGuerra: 'Francisco',
  funcao: 'Master',
  email: 'emailMockTest@email.com',
  name: 'qudlsjakf',
  password: 'password',
  phone: '325632634',
  typeUser: UserType.Master,
};
