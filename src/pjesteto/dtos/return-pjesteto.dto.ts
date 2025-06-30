import { PjesTetoEntity } from '../entities/pjesteto.entity';

export class ReturnPjesTetoDto {
  id: number;
  imagemUrl?: string;
  nomeVerba: string;
  codVerba: number;
  tetoOf: number;
  tetoPrc: number;
  mes: number;
  ano: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(pjesteto: PjesTetoEntity) {
    this.id = pjesteto.id;
    this.imagemUrl = pjesteto.imagemUrl;
    this.nomeVerba = pjesteto.nomeVerba;
    this.codVerba = pjesteto.codVerba;
    this.tetoOf = pjesteto.tetoOf;
    this.tetoPrc = pjesteto.tetoPrc;
    this.mes = pjesteto.mes;
    this.ano = pjesteto.ano;
    this.createdAt = pjesteto.createdAt;
    this.updatedAt = pjesteto.updatedAt;
  }
}
