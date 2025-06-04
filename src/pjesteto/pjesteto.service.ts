import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesTetoEntity } from './entities/pjesteto.entity';
import { ReturnPjesTetoDto } from './dtos/return-pjesteto.dto';
import { CreatePjesTetoDto } from './dtos/create-pjesteto.dto';

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

  async findAll(): Promise<ReturnPjesTetoDto[]> {
    const items = await this.pjestetoRepository.find();
    return items.map((item) => new ReturnPjesTetoDto(item));
  }

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
