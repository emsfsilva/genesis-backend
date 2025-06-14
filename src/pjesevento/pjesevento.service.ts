import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesEventoEntity } from './entities/pjesevento.entity';
import { ReturnPjesEventoDto } from './dtos/return-pjesevento.dto';
import { CreatePjesEventoDto } from './dtos/create-pjesevento.dto';
import { PjesDistEntity } from 'src/pjesdist/entities/pjesdist.entity';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

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
    return saved;
  }

  async findAll(): Promise<ReturnPjesEventoDto[]> {
    return this.pjeseventoRepository.find();
  }

  async findOne(id: number): Promise<ReturnPjesEventoDto> {
    const pjesevento = await this.pjeseventoRepository.findOneBy({ id });
    if (!pjesevento) {
      throw new NotFoundException('Evento não encontrado');
    }
    return pjesevento;
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
    return this.pjeseventoRepository.save(updated);
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
