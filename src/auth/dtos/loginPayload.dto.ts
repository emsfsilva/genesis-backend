import { UserEntity } from '../../user/entities/user.entity';

//Esses são os dados do TOKEN
export class LoginPayload {
  id: number;
  email: string;
  phone: string;
  pg: string;
  mat: number;
  nomeGuerra: string;
  funcao: string;
  typeUser: number;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.phone = user.phone;
    this.pg = user.pg;
    this.mat = user.mat;
    this.nomeGuerra = user.nomeGuerra;
    this.funcao = user.funcao;
    this.typeUser = user.typeUser;
  }
}
