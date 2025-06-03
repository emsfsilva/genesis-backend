import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesOperacaoEntity } from './entities/pjesoperacao.entity';
import { CreatePjesOperacaoDto } from './dtos/create-pjesoperacao.dto';
import { ReturnPjesOperacaoDto } from './dtos/return-pjesoperacao.dto';

@Injectable()
export class PjesOperacaoService {
  constructor(
    @InjectRepository(PjesOperacaoEntity)
    private readonly pjesOperacaoRepository: Repository<PjesOperacaoEntity>,
  ) {}

  async create(dto: CreatePjesOperacaoDto): Promise<ReturnPjesOperacaoDto> {
    const entity = this.pjesOperacaoRepository.create(dto);
    const saved = await this.pjesOperacaoRepository.save(entity);
    return new ReturnPjesOperacaoDto(saved);
  }

  async findAll(): Promise<ReturnPjesOperacaoDto[]> {
    const operations = await this.pjesOperacaoRepository.find({
      relations: ['pjesevento'],
    });
    return operations.map((op) => new ReturnPjesOperacaoDto(op));
  }

  async findOne(id: number): Promise<ReturnPjesOperacaoDto> {
    const operation = await this.pjesOperacaoRepository.findOne({
      where: { id },
      relations: ['pjesevento'],
    });

    if (!operation) throw new NotFoundException('Operação não encontrada');

    return new ReturnPjesOperacaoDto(operation);
  }

  async update(
    id: number,
    dto: CreatePjesOperacaoDto,
  ): Promise<ReturnPjesOperacaoDto> {
    const operation = await this.pjesOperacaoRepository.preload({
      id,
      ...dto,
    });

    if (!operation) throw new NotFoundException('Operação não encontrada');

    const updated = await this.pjesOperacaoRepository.save(operation);
    return new ReturnPjesOperacaoDto(updated);
  }

  async remove(id: number): Promise<void> {
    const operation = await this.pjesOperacaoRepository.findOne({
      where: { id },
    });

    if (!operation) throw new NotFoundException('Operação não encontrada');

    await this.pjesOperacaoRepository.remove(operation);
  }
}
