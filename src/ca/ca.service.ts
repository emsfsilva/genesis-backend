import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CaEntity } from './entities/ca.entity';
import { CreateCaDTO } from './dtos/create-ca.dto';
import { UpdateCaDTO } from './dtos/update-ca.dto';

@Injectable()
export class CaService {
  constructor(
    @InjectRepository(CaEntity)
    private readonly caRepository: Repository<CaEntity>,
  ) {}

  async findAll(): Promise<CaEntity[]> {
    const cas = await this.caRepository.find();

    if (!cas || cas.length === 0) {
      throw new NotFoundException('Nenhum Ca Encontrado');
    }

    return cas;
  }

  async createCa(createCa: CreateCaDTO): Promise<CaEntity> {
    return this.caRepository.save({
      ...createCa,
    });
  }

  async findCaById(caId: number): Promise<CaEntity> {
    const ca = await this.caRepository.findOne({
      where: {
        id: caId,
      },
    });

    if (!ca) {
      throw new NotFoundException(`Ca id: ${caId} Não Eontrado`);
    }

    return ca;
  }

  async deleteCa(caId: number): Promise<DeleteResult> {
    await this.findCaById(caId);

    return this.caRepository.delete({ id: caId });
  }

  async updateCa(updateCa: UpdateCaDTO, caId: number): Promise<CaEntity> {
    const ca = await this.findCaById(caId);

    return this.caRepository.save({
      ...ca,
      ...updateCa,
    });
  }
}
