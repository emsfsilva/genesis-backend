import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesEventoEntity } from './entities/pjesevento.entity';
import { ReturnPjesEventoDto } from './dtos/return-pjesevento.dto';
import { CreatePjesEventoDto } from './dtos/create-pjesevento.dto';

@Injectable()
export class PjesEventoService {
  constructor(
    @InjectRepository(PjesEventoEntity)
    private readonly pjeseventoRepository: Repository<PjesEventoEntity>,
  ) {}

  async create(
    createPjesEventoDto: CreatePjesEventoDto,
  ): Promise<ReturnPjesEventoDto> {
    const pjesevento = this.pjeseventoRepository.create(createPjesEventoDto);
    await this.pjeseventoRepository.save(pjesevento);
    return pjesevento;
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
    updatePjesEventoDto: CreatePjesEventoDto,
  ): Promise<ReturnPjesEventoDto> {
    const existing = await this.pjeseventoRepository.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    const updated = this.pjeseventoRepository.merge(
      existing,
      updatePjesEventoDto,
    );
    return this.pjeseventoRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const pjesevento = await this.findOne(id);
    await this.pjeseventoRepository.remove(pjesevento as PjesEventoEntity);
  }
}
