import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userEntityMock: UserEntity = {
  pg: 'Cb',
  mat: 1157590,
  nomeGuerra: 'Francisco',
  funcao: 'Master',
  createdAt: new Date(),
  ome: 'DPO',
  email: 'emailmock@emali.com',
  id: 43242,
  password: '$2b$10$S62WmVpIxL52Z.0y22DWfuaAz8.XUNESChWP.AlMFZnOJ9n9uiqi.',
  phone: '321532523532',
  typeUser: UserType.Master,
  updatedAt: new Date(),
};
