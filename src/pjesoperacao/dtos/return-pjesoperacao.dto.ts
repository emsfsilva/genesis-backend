import { PjesOperacaoEntity } from '../entities/pjesoperacao.entity';

export class ReturnPjesOperacaoDto {
  id: number;
  nomeOperacao: string;
  omeId: number;
  pjesEventoId: number;
  ttCtOfDist: number;
  ttCtPrcDist: number;
  ttCtOfExe: number;
  ttCtPrcExe: number;
  userId: number;
  statusOperacao: string;
  mes: number;
  ano: number;
  createdAt: Date;
  updatedAt: Date;
  pjesevento?: {
    id: number;
    nomeEvento: string;
  };

  constructor(pjesOperacaoEntity: PjesOperacaoEntity) {
    this.id = pjesOperacaoEntity.id;
    this.nomeOperacao = pjesOperacaoEntity.nomeOperacao;
    this.omeId = pjesOperacaoEntity.omeId;
    this.pjesEventoId = pjesOperacaoEntity.pjesEventoId;
    this.ttCtOfDist = pjesOperacaoEntity.ttCtOfDist;
    this.ttCtPrcDist = pjesOperacaoEntity.ttCtPrcDist;
    this.ttCtOfExe = pjesOperacaoEntity.ttCtOfExe;
    this.ttCtPrcExe = pjesOperacaoEntity.ttCtPrcExe;
    this.userId = pjesOperacaoEntity.userId;
    this.statusOperacao = pjesOperacaoEntity.statusOperacao;
    this.mes = pjesOperacaoEntity.mes;
    this.ano = pjesOperacaoEntity.ano;

    if (pjesOperacaoEntity.pjesevento) {
      this.pjesevento = {
        id: pjesOperacaoEntity.pjesevento.id,
        nomeEvento: pjesOperacaoEntity.pjesevento.nomeEvento,
      };
    }
  }
}
