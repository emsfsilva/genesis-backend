import { PjesDistEntity } from 'src/pjesdist/entities/pjesdist.entity';
import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';
import { StatusEventoEnum } from 'src/utils/status-evento.enum';

export class ReturnPjesEventoDto {
  id: number;
  pjesDistId: number;
  codVerba: number;
  nomeEvento: string;
  omeId: number;
  ttCtOfEvento: number;
  ttCtPrcEvento: number;
  userId: number;
  statusEvento: StatusEventoEnum;

  // Relacionamentos aninhados
  pjesdist?: PjesDistEntity;
  pjesoperacoes?: PjesOperacaoEntity[];

  somaCtOfOper?: number;
  somaCtPrcOper?: number;
  somaCotaOfEscala?: number;
  somaCotaPrcEscala?: number;

  // Dados derivados
  mes?: number;
  ano?: number;

  nomeOme?: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(entity: any) {
    this.id = entity.id;
    this.pjesDistId = entity.pjesDistId;
    this.codVerba = entity.codVerba;
    this.nomeEvento = entity.nomeEvento;
    this.omeId = entity.omeId;
    this.ttCtOfEvento = entity.ttCtOfEvento;
    this.ttCtPrcEvento = entity.ttCtPrcEvento;
    this.userId = entity.userId;
    this.statusEvento = entity.statusEvento;
    this.mes = entity.mes;
    this.ano = entity.ano;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.pjesdist = entity.pjesdist;
    this.nomeOme = entity.ome?.nomeOme;
    this.pjesoperacoes = entity.pjesoperacoes;

    // Soma cotas de operações
    this.somaCtOfOper = entity.pjesoperacoes?.reduce(
      (sum, op) => sum + (op.ttCtOfOper || 0),
      0,
    );

    this.somaCtPrcOper = entity.pjesoperacoes?.reduce(
      (sum, op) => sum + (op.ttCtPrcOper || 0),
      0,
    );

    // ✅ Soma real de cotas por tipo de escala:
    let totalOf = 0;
    let totalPrc = 0;

    for (const operacao of entity.pjesoperacoes || []) {
      for (const escala of operacao.pjesescalas || []) {
        if (escala.tipoSgp === 'O') {
          totalOf += escala.ttCota || 0;
        } else if (escala.tipoSgp === 'P') {
          totalPrc += escala.ttCota || 0;
        }
      }
    }

    this.somaCotaOfEscala = totalOf;
    this.somaCotaPrcEscala = totalPrc;
  }
}
