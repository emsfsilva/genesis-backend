import { PjesDistEntity } from 'src/pjesdist/entities/pjesdist.entity';
import { StatusEventoEnum } from 'src/utils/status-evento.enum';

export class ReturnPjesEventoDto {
  id: number;
  pjesDistId: number;
  nomeEvento: string;
  omeId: number;
  ttCtOfEvento: number;
  ttCtPrcEvento: number;
  userId: number;
  statusEvento: StatusEventoEnum;

  // Relacionamentos aninhados
  pjesdist?: PjesDistEntity;

  // Dados derivados
  mes?: number;
  ano?: number;

  createdAt: Date;
  updatedAt: Date;

  constructor(entity: any) {
    this.id = entity.id;
    this.pjesDistId = entity.pjesDistId;
    this.omeId = entity.omeId;
    this.ttCtOfEvento = entity.ttCtOfEvento;
    this.ttCtPrcEvento = entity.ttCtPrcEvento;
    this.userId = entity.userId;
    this.statusEvento = entity.statusEvento;
    this.mes = entity.mes;
    this.ano = entity.ano;

    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;

    // Relacionamentos completos (aninhados)
    this.pjesdist = entity.pjesdist;

    // Dados derivados (caso queira simplificar o consumo no frontend)
    this.mes = entity.pjesevento?.mes ?? undefined;
    this.ano = entity.pjesevento?.ano ?? undefined;
  }
}
