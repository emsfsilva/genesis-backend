import { ReturnAddressDto } from '../../address/dtos/returnAddress.dto';
import { UserType } from '../enum/user-type.enum';
import { ReturnMasterDTO } from 'src/master/dtos/return-master.dto';

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  orgao: string;
  pg: string;
  mat: number;
  nomeGuerra: string;
  funcao: string;
  typeUser: UserType;
  addresses?: ReturnAddressDto[];
  master?: ReturnMasterDTO;

  constructor(userEntity: any) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.cpf = userEntity.cpf;
    this.orgao = userEntity.orgao;
    this.pg = userEntity.pg;
    this.mat = userEntity.mat;
    this.nomeGuerra = userEntity.nomeGuerra;
    this.funcao = userEntity.funcao;
    this.typeUser = userEntity.typeUser;

    this.addresses = userEntity.addresses
      ? userEntity.addresses.map((address) => new ReturnAddressDto(address))
      : undefined;

    this.master = userEntity.master
      ? new ReturnMasterDTO(userEntity.master)
      : undefined;
  }
}
