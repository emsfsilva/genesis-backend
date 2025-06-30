import { ReturnPjesEventoDto } from 'src/pjesevento/dtos/return-pjesevento.dto';
import { PjesDistEntity } from '../entities/pjesdist.entity';
import { StatusDistEnum } from 'src/utils/status-dist.enum';

export class ReturnPjesDistDto {
  id: number;
  nomeDist: string;
  diretoriaId: number;
  pjesTetoId: number;
  codVerba: number;
  ttCtOfDist: number;
  ttCtPrcDist: number;
  userId: number;
  statusDist: StatusDistEnum;
  mes: number;
  ano: number;
  createdAt: Date;
  updatedAt: Date;

  eventos?: ReturnPjesEventoDto[];
  totalOfDistribuido: number;
  totalPrcDistribuido: number;

  nomeDiretoria: string;

  constructor(dist: PjesDistEntity) {
    this.id = dist.id;
    this.nomeDist = dist.nomeDist;
    this.pjesTetoId = dist.pjesTetoId;
    this.diretoriaId = dist.diretoriaId;
    this.codVerba = dist.codVerba;
    this.ttCtOfDist = dist.ttCtOfDist;
    this.ttCtPrcDist = dist.ttCtPrcDist;
    this.userId = dist.userId;
    this.statusDist = dist.statusDist;
    this.mes = dist.mes;
    this.ano = dist.ano;
    this.createdAt = dist.createdAt;
    this.updatedAt = dist.updatedAt;


    this.nomeDiretoria = dist.diretoria?.nomeDiretoria;

    if (Array.isArray(dist.pjeseventos) && dist.pjeseventos.length > 0) {
      this.eventos = dist.pjeseventos.map((ev) => new ReturnPjesEventoDto(ev));
      this.totalOfDistribuido = dist.pjeseventos.reduce(
        (sum, ev) => sum + ev.ttCtOfEvento,
        0,
      );
      this.totalPrcDistribuido = dist.pjeseventos.reduce(
        (sum, ev) => sum + ev.ttCtPrcEvento,
        0,
      );
    } else {
      this.totalOfDistribuido = 0;
      this.totalPrcDistribuido = 0;
    }
  }
}
