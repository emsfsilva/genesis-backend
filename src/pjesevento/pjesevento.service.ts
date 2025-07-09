import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { PjesEventoEntity } from './entities/pjesevento.entity';
import { ReturnPjesEventoDto } from './dtos/return-pjesevento.dto';
import { CreatePjesEventoDto } from './dtos/create-pjesevento.dto';
import { PjesDistEntity } from 'src/pjesdist/entities/pjesdist.entity';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { UpdateStatusPjesEventoDto } from './dtos/update-status-pjesevento.dto';

@Injectable()
export class PjesEventoService {
  constructor(
    @InjectRepository(PjesEventoEntity)
    private readonly pjeseventoRepository: Repository<PjesEventoEntity>,

    @InjectRepository(PjesDistEntity)
    private readonly pjesDistRepository: Repository<PjesDistEntity>,
  ) {}

  async create(
    createDto: CreatePjesEventoDto,
    user: LoginPayload,
  ): Promise<ReturnPjesEventoDto> {
    const { pjesDistId, ttCtOfEvento, ttCtPrcEvento } = createDto;

    // Busca a distribuição com seus eventos relacionados
    const dist = await this.pjeseventoRepository.manager
      .getRepository(PjesDistEntity)
      .findOne({
        where: { id: createDto.pjesDistId },
        relations: ['pjeseventos'],
      });

    if (!dist) {
      throw new NotFoundException('Distribuição base não encontrada');
    }

    if (dist.statusDist === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Distribuição homologada. Contate o Adminitrador.',
      );
    }

    // Soma os totais já distribuídos em eventos
    const totalOficiaisDistribuidos =
      dist.pjeseventos?.reduce((sum, ev) => sum + ev.ttCtOfEvento, 0) ?? 0;
    const totalPracasDistribuidos =
      dist.pjeseventos?.reduce((sum, ev) => sum + ev.ttCtPrcEvento, 0) ?? 0;

    // Soma com a nova requisição
    const novaSomaOf = totalOficiaisDistribuidos + ttCtOfEvento;
    const novaSomaPrc = totalPracasDistribuidos + ttCtPrcEvento;

    // Regras de validação
    if (novaSomaOf > dist.ttCtOfDist) {
      throw new BadRequestException(
        `Erro: Uso das cotas de oficiais excede o estabelecido pela distribuição`,
      );
    }

    if (novaSomaPrc > dist.ttCtPrcDist) {
      throw new BadRequestException(
        `Erro: Uso das cotas das praças excede o estabelecido pela distribuição`,
      );
    }

    // Criação do evento
    const pjesevento = this.pjeseventoRepository.create({
      ...createDto,
      codVerba: dist.codVerba,
    });
    const saved = await this.pjeseventoRepository.save(pjesevento);

    // Recarrega com relação `ome` incluída
    const withRelations = await this.pjeseventoRepository.findOne({
      where: { id: saved.id },
      relations: ['ome'],
    });

    return new ReturnPjesEventoDto(withRelations);
  }

  async findAll(
    mes?: number,
    ano?: number,
    user?: LoginPayload,
  ): Promise<ReturnPjesEventoDto[]> {
    const where: any = {};

    if (mes) {
      where.pjesdist = { mes };
    }

    if (ano) {
      where.pjesdist = { ...where.pjesdist, ano };
    }

    const items = await this.pjeseventoRepository.find({
      where,
      relations: [
        'ome',
        'ome.diretoria',
        'pjesoperacoes.pjesescalas',
        'pjesdist',
        'pjesdist.diretoria',
      ],
    });

    let filtrados = items;

    if (user?.typeUser === 1) {
      // Apenas eventos da OME do usuário
      filtrados = items.filter((evento) => evento.omeId === user.omeId);
    } else if (user?.typeUser === 3) {
      filtrados = items.filter((evento) => {
        if (evento.codVerba !== 247) {
          return evento.pjesdist?.diretoriaId === user.ome?.diretoriaId;
        } else {
          return evento.ome?.diretoriaId === user.ome?.diretoriaId;
        }
      });
    }

    return filtrados.map((item) => new ReturnPjesEventoDto(item));
  }

  /*
  async findAllResumoPorDiretoria(
    mes?: number,
    ano?: number,
    omeMin?: number,
    omeMax?: number,
  ): Promise<ReturnPjesEventoDto[]> {
    const where: any = {};

    if (mes) {
      where.pjesdist = { mes };
    }

    if (ano) {
      where.pjesdist = { ...where.pjesdist, ano };
    }

    if (omeMin !== undefined && omeMax !== undefined) {
      where.omeId = Between(omeMin, omeMax);
    }

    const items = await this.pjeseventoRepository.find({
      where,
      relations: [
        'ome',
        'ome.diretoria',
        'pjesoperacoes.pjesescalas',
        'pjesdist',
      ],
    });

    return items.map((item) => new ReturnPjesEventoDto(item));
  }

  */

  async findAllResumoPorDiretoria(
    mes?: number,
    ano?: number,
    omeMin?: number,
    omeMax?: number,
    user?: LoginPayload,
  ): Promise<{
    eventos: ReturnPjesEventoDto[];
    resumo: {
      somattCtOfEvento: number;
      somattCotaOfEscala: number;
      somattCtPrcEvento: number;
      somattCotaPrcEscala: number;
      valorTtPlanejado: number;
      valorTtExecutado: number;
      saldoFinal: number;
    };
  }> {
    const where: any = {};

    if (mes) where.pjesdist = { mes };
    if (ano) where.pjesdist = { ...where.pjesdist, ano };
    if (omeMin !== undefined && omeMax !== undefined) {
      where.omeId = Between(omeMin, omeMax);
    }

    const items = await this.pjeseventoRepository.find({
      where,
      relations: [
        'ome',
        'ome.diretoria',
        'pjesoperacoes.pjesescalas',
        'pjesdist',
      ],
    });

    // Filtro adicional por diretoria do usuário, se for typeUser === 3
    let filtrados = items;

    if (user?.typeUser === 1) {
      filtrados = items.filter((evento) => evento.omeId === user.omeId);
    } else if (user?.typeUser === 3) {
      filtrados = items.filter((evento) => {
        if (evento.codVerba !== 247) {
          return evento.pjesdist?.diretoriaId === user.ome?.diretoriaId;
        } else {
          return evento.ome?.diretoriaId === user.ome?.diretoriaId;
        }
      });
    }

    const dtos = filtrados.map((item) => new ReturnPjesEventoDto(item));

    const resumo = {
      somattCtOfEvento: 0,
      somattCotaOfEscala: 0,
      somattCtPrcEvento: 0,
      somattCotaPrcEscala: 0,
      valorTtPlanejado: 0,
      valorTtExecutado: 0,
      saldoFinal: 0,
    };

    for (const dto of dtos) {
      resumo.somattCtOfEvento += dto.somattCtOfEvento;
      resumo.somattCotaOfEscala += dto.somattCotaOfEscala;
      resumo.somattCtPrcEvento += dto.somattCtPrcEvento;
      resumo.somattCotaPrcEscala += dto.somattCotaPrcEscala;
      resumo.valorTtPlanejado += dto.valorTtPlanejado || 0;
      resumo.valorTtExecutado += dto.valorTtExecutado || 0;
      resumo.saldoFinal += dto.saldoFinal || 0;
    }

    return { eventos: dtos, resumo };
  }

  async findResumoFiltradoPorDiretoria(
    mes?: number,
    ano?: number,
    user?: LoginPayload,
  ): Promise<any> {
    const where: any = {};

    if (mes) where.pjesdist = { mes };
    if (ano) where.pjesdist = { ...where.pjesdist, ano };

    const eventos = await this.pjeseventoRepository.find({
      where,
      relations: [
        'ome',
        'ome.diretoria',
        'pjesoperacoes.pjesescalas',
        'pjesdist',
      ],
    });

    // Aplica o filtro por diretoriaId se for typeUser 3
    let filtrados = eventos;

    if (user?.typeUser === 1) {
      filtrados = eventos.filter((evento) => evento.omeId === user.omeId);
    } else if (user?.typeUser === 3) {
      filtrados = eventos.filter((evento) => {
        if (evento.codVerba !== 247) {
          return evento.pjesdist?.diretoriaId === user.ome?.diretoriaId;
        } else {
          return evento.ome?.diretoriaId === user.ome?.diretoriaId;
        }
      });
    }

    // Transforma cada evento em DTO
    const dtos = filtrados.map((item) => new ReturnPjesEventoDto(item));

    // Agrega os valores desejados
    const resumo = {
      somattCtOfEvento: 0,
      somattCotaOfEscala: 0,
      somattCtPrcEvento: 0,
      somattCotaPrcEscala: 0,
      valorTtPlanejado: 0,
      valorTtExecutado: 0,
      saldoFinal: 0,
    };

    for (const dto of dtos) {
      resumo.somattCtOfEvento += dto.somattCtOfEvento;
      resumo.somattCotaOfEscala += dto.somattCotaOfEscala;
      resumo.somattCtPrcEvento += dto.somattCtPrcEvento;
      resumo.somattCotaPrcEscala += dto.somattCotaPrcEscala;
      resumo.valorTtPlanejado += dto.valorTtPlanejado || 0;
      resumo.valorTtExecutado += dto.valorTtExecutado || 0;
      resumo.saldoFinal += dto.saldoFinal || 0;
    }

    return resumo;
  }

  async findOne(id: number): Promise<ReturnPjesEventoDto> {
    const pjesevento = await this.pjeseventoRepository.findOneBy({ id });
    if (!pjesevento) {
      throw new NotFoundException('Evento não encontrado');
    }
    return new ReturnPjesEventoDto(pjesevento);
  }

  async update(
    id: number,
    updateDto: CreatePjesEventoDto,
    user: LoginPayload,
  ): Promise<ReturnPjesEventoDto> {
    // Busca o evento existente com suas relações
    const existing = await this.pjeseventoRepository.findOne({
      where: { id },
      relations: ['pjesdist'],
    });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    // ✅ Impede troca de teto
    if (updateDto.pjesDistId && updateDto.pjesDistId !== existing.pjesDistId) {
      throw new BadRequestException(
        'Não é permitido alterar o tipo da verba ja criada.',
      );
    }

    // Busca a distribuição base
    const dist = await this.pjeseventoRepository.manager
      .getRepository(PjesDistEntity)
      .findOne({
        where: { id: existing.pjesDistId },
        relations: ['pjeseventos'],
      });

    if (!dist) {
      throw new NotFoundException('Distribuição base não encontrada');
    }

    if (dist.statusDist === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Atualização inválida: Evento homologado. Contate o administrador.',
      );
    }

    // Soma atual total (inclui o evento atual)
    const somaAtualOficiais = dist.pjeseventos.reduce(
      (sum, ev) => sum + ev.ttCtOfEvento,
      0,
    );

    const somaAtualPracas = dist.pjeseventos.reduce(
      (sum, ev) => sum + ev.ttCtPrcEvento,
      0,
    );

    // Subtrai os valores antigos do evento atual e adiciona os novos
    const novaSomaOf =
      somaAtualOficiais - existing.ttCtOfEvento + updateDto.ttCtOfEvento;
    const novaSomaPrc =
      somaAtualPracas - existing.ttCtPrcEvento + updateDto.ttCtPrcEvento;

    // Validação dos limites
    if (novaSomaOf > dist.ttCtOfDist) {
      throw new BadRequestException(
        `Atualização inválida: oficiais excedem limite da distribuição (${novaSomaOf} > ${dist.ttCtOfDist})`,
      );
    }

    if (novaSomaPrc > dist.ttCtPrcDist) {
      throw new BadRequestException(
        `Atualização inválida: praças excedem limite da distribuição (${novaSomaPrc} > ${dist.ttCtPrcDist})`,
      );
    }
    // 🔒 Remove pjesTetoId para garantir que não será alterado
    delete updateDto.pjesDistId;

    // Atualiza o evento
    const updated = this.pjeseventoRepository.merge(existing, updateDto);
    await this.pjeseventoRepository.save(updated);

    const withRelations = await this.pjeseventoRepository.findOne({
      where: { id },
      relations: ['ome'],
    });

    return new ReturnPjesEventoDto(withRelations);
  }

  async updateStatusEvento(
    id: number,
    dto: UpdateStatusPjesEventoDto,
    user: LoginPayload,
  ): Promise<ReturnPjesEventoDto> {
    const evento = await this.pjeseventoRepository.findOne({
      where: { id },
      relations: ['pjesdist', 'ome'],
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    const dist = evento.pjesdist;

    if (!dist) {
      throw new NotFoundException('Distribuição do evento não encontrada');
    }

    if (dist.statusDist === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Evento pertencente a uma distribuição homologada. Alteração não permitida.',
      );
    }

    evento.statusEvento = dto.statusEvento;
    const saved = await this.pjeseventoRepository.save(evento);

    return new ReturnPjesEventoDto(saved);
  }

  async remove(id: number, user: LoginPayload): Promise<void> {
    const evento = await this.pjeseventoRepository.findOne({
      where: { id },
      relations: ['pjesdist'],
    });

    if (!evento) throw new NotFoundException('Evento não encontrada');

    const dist = await this.pjesDistRepository.findOne({
      where: { id: evento.pjesDistId },
    });

    if (!dist) throw new NotFoundException('Distribuição não encontrado');

    if (dist.statusDist === 'HOMOLOGADA' && user.typeUser !== 10) {
      throw new BadRequestException(
        'Evento homologado. Exclusão não permitida.',
      );
    }

    await this.pjeseventoRepository.remove(evento);
  }
}
