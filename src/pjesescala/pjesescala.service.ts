import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesEscalaEntity } from './entities/pjesescala.entity';
import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { CreatePjesEscalaDto } from './dtos/create-pjesescala.dto';
import { UpdatePjesEscalaDto } from './dtos/update-pjesescala.dto';

@Injectable()
export class PjesEscalaService {
  constructor(
    @InjectRepository(PjesEscalaEntity)
    private readonly pjesEscalaRepository: Repository<PjesEscalaEntity>,

    @InjectRepository(PjesEventoEntity)
    private readonly pjesEventoRepository: Repository<PjesEventoEntity>,
  ) {}

  async create(dto: CreatePjesEscalaDto): Promise<PjesEscalaEntity> {
    const evento = await this.pjesEventoRepository.findOne({
      where: { id: dto.pjesEventoId },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    const dataInicio = new Date(dto.dataInicio);
    const mes = dataInicio.getMonth() + 1;
    const ano = dataInicio.getFullYear();

    if (mes !== evento.mes || ano !== evento.ano) {
      throw new BadRequestException(
        'A data de início não corresponde ao mês/ano do evento.',
      );
    }

    const escala = this.pjesEscalaRepository.create(dto);
    const saved = await this.pjesEscalaRepository.save(escala);

    return this.pjesEscalaRepository.findOne({
      where: { id: saved.id },
      relations: ['pjesoperacao', 'pjesevento'],
    });
  }

  async findAll(): Promise<PjesEscalaEntity[]> {
    return await this.pjesEscalaRepository.find({
      relations: ['pjesoperacao', 'pjesevento'],
    });
  }

  async findOne(id: number): Promise<PjesEscalaEntity> {
    const escala = await this.pjesEscalaRepository.findOne({
      where: { id },
      relations: ['pjesoperacao', 'pjesevento'],
    });

    if (!escala) {
      throw new NotFoundException('Escala não encontrada');
    }

    return escala;
  }

  async update(
    id: number,
    dto: UpdatePjesEscalaDto,
  ): Promise<PjesEscalaEntity> {
    const escala = await this.pjesEscalaRepository.findOne({ where: { id } });
    if (!escala) {
      throw new NotFoundException('Escala não encontrada');
    }

    if (dto.dataInicio || dto.pjesEventoId) {
      const eventoId = dto.pjesEventoId ?? escala.pjesEventoId;
      const evento = await this.pjesEventoRepository.findOne({
        where: { id: eventoId },
      });

      if (!evento) {
        throw new NotFoundException('Evento não encontrado');
      }

      const dataInicio = new Date(dto.dataInicio ?? escala.dataInicio);
      const mes = dataInicio.getMonth() + 1;
      const ano = dataInicio.getFullYear();

      if (mes !== evento.mes || ano !== evento.ano) {
        throw new BadRequestException(
          'A nova data de início não corresponde ao mês/ano do evento.',
        );
      }
    }

    await this.pjesEscalaRepository.update(id, dto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const exists = await this.pjesEscalaRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Escala não encontrada');
    }

    await this.pjesEscalaRepository.delete(id);
  }
}
