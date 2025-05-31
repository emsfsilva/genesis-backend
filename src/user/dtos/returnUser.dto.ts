import { ReturnAlunoDTO } from 'src/aluno/dtos/return-aluno.dto';
import { ReturnAddressDto } from '../../address/dtos/returnAddress.dto';
import { UserType } from '../enum/user-type.enum';
import { ReturnAdmDTO } from 'src/adm/dtos/return-adm.dto';
import { ReturnCaDTO } from 'src/ca/dtos/return-ca.dto';
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
  aluno?: ReturnAlunoDTO;
  adm?: ReturnAdmDTO;
  ca?: ReturnCaDTO;
  master?: ReturnMasterDTO;

  constructor(userEntity: any, grauAtual?: number) {
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

    this.aluno = userEntity.aluno
      ? new ReturnAlunoDTO(userEntity.aluno, grauAtual)
      : undefined;

    this.adm = userEntity.adm ? new ReturnAdmDTO(userEntity.adm) : undefined;

    this.ca = userEntity.ca ? new ReturnCaDTO(userEntity.ca) : undefined;

    this.master = userEntity.master
      ? new ReturnMasterDTO(userEntity.master)
      : undefined;
  }
}
