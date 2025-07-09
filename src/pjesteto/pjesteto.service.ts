import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesTetoEntity } from './entities/pjesteto.entity';
import { ReturnPjesTetoDto } from './dtos/return-pjesteto.dto';
import { CreatePjesTetoDto } from './dtos/create-pjesteto.dto';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Injectable()
export class PjesTetoService {
  constructor(
    @InjectRepository(PjesTetoEntity)
    private readonly pjestetoRepository: Repository<PjesTetoEntity>,
  ) {}

  async create(dto: CreatePjesTetoDto): Promise<ReturnPjesTetoDto> {
    const entity = this.pjestetoRepository.create(dto);
    const saved = await this.pjestetoRepository.save(entity);
    return new ReturnPjesTetoDto(saved);
  }

  async findAll(ano?: number, mes?: number): Promise<ReturnPjesTetoDto[]> {
    const where: any = {};

    if (ano) where.ano = ano;
    if (mes) where.mes = mes;

    const items = await this.pjestetoRepository.find({
      where,
      relations: [
        'pjesdists',
        'pjesdists.diretoria',
        'pjesdists.pjeseventos',
        'pjesdists.pjeseventos.pjesoperacoes',
        'pjesdists.pjeseventos.pjesoperacoes.pjesescalas',
      ],
      order: {
        ano: 'ASC',
        mes: 'ASC',
      },
    });

    return items.map((item) => new ReturnPjesTetoDto(item));
  }

  /*
  async findAll(
    ano?: number,
    mes?: number,
    user?: LoginPayload,
  ): Promise<ReturnPjesTetoDto[]> {
    const where: any = {};

    if (ano) where.ano = ano;
    if (mes) where.mes = mes;

    const items = await this.pjestetoRepository.find({
      where,
      relations: [
        'pjesdists',
        'pjesdists.diretoria',
        'pjesdists.pjeseventos',
        'pjesdists.pjeseventos.pjesoperacoes',
        'pjesdists.pjeseventos.pjesoperacoes.pjesescalas',
      ],
      order: {
        ano: 'ASC',
        mes: 'ASC',
      },
    });

    let filtrados = items;

    // Aplicar filtro de OME se o usuário for typeUser 1
    if (user?.typeUser === 1) {
      filtrados = items.filter((teto) =>
        teto.pjesdists?.some((dist) =>
          dist.pjeseventos?.some((evento) => evento.omeId === user.omeId),
        ),
      );
    }

    return filtrados.map((item) => new ReturnPjesTetoDto(item));
  }

  */

  async findOne(id: number): Promise<ReturnPjesTetoDto> {
    const entity = await this.pjestetoRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Pjesteto não encontrado');
    }
    return new ReturnPjesTetoDto(entity);
  }

  async update(id: number, dto: CreatePjesTetoDto): Promise<ReturnPjesTetoDto> {
    const entity = await this.pjestetoRepository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Pjesteto não encontrado');
    }

    // Mescla os dados manualmente
    const updatedEntity = {
      ...entity,
      ...dto,
      updatedAt: new Date(), // opcional: forçar atualização manual
    };

    const saved = await this.pjestetoRepository.save(updatedEntity);
    return new ReturnPjesTetoDto(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.pjestetoRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Pjesteto não encontrado');
    }
    await this.pjestetoRepository.remove(entity);
  }
}
