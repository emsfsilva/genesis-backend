import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';

export class ReturnPjesEscalaDto {
  id: number;
  pjesEventoId: number;
  codVerba: number;
  pjesOperacaoId: number;
  omeId: number;
  pgSgp: string;
  matSgp: number;
  nomeGuerraSgp: string;
  nomeCompletoSgp: string;
  omeSgp: number;
  tipoSgp: string;
  nunfuncSgp: number;
  nunvincSgp: number;
  situacaoSgp: string;
  dataInicio: Date;
  dataFinal: Date;
  horaInicio: string;
  horaFinal: string;
  phone?: string;
  localApresentacao?: string;
  ttCota: number;
  userId: number;
  statusEscala: string;

  // Relacionamentos aninhados
  pjesevento?: PjesEventoEntity;
  pjesoperacao?: PjesOperacaoEntity;

  // Dados derivados
  mes?: number;
  ano?: number;

  createdAt: Date;
  updatedAt: Date;

  constructor(entity: any) {
    this.id = entity.id;
    this.pjesEventoId = entity.pjesEventoId;
    this.codVerba = entity.codVerba;
    this.pjesOperacaoId = entity.pjesOperacaoId;
    this.omeId = entity.omeId;
    this.pgSgp = entity.pgSgp;
    this.matSgp = entity.matSgp;
    this.nomeGuerraSgp = entity.nomeGuerraSgp;
    this.nomeCompletoSgp = entity.nomeCompletoSgp;
    this.omeSgp = entity.omeSgp;
    this.tipoSgp = entity.tipoSgp;
    this.nunfuncSgp = entity.nunfuncSgp;
    this.nunvincSgp = entity.nunvincSgp;
    this.situacaoSgp = entity.situacaoSgp;
    this.dataInicio = entity.dataInicio;
    this.dataFinal = entity.dataFinal;
    this.horaInicio = entity.horaInicio;
    this.horaFinal = entity.horaFinal;
    this.phone = entity.phone;
    this.localApresentacao = entity.localApresentacao;
    this.ttCota = entity.ttCota;
    this.userId = entity.userId;
    this.statusEscala = entity.statusEscala;

    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;

    // Relacionamentos completos (aninhados)
    this.pjesevento = entity.pjesevento;
    this.pjesoperacao = entity.pjesoperacao;

    // Dados derivados (caso queira simplificar o consumo no frontend)
    this.mes = entity.pjesevento?.mes ?? undefined;
    this.ano = entity.pjesevento?.ano ?? undefined;
  }
}
