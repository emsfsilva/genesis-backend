import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { SubcomEntity } from './entities/subcom.entity';
import { CreateSubcomDTO } from './dtos/create-subcom.dto';
import { UpdateSubcomDTO } from './dtos/update-subcom.dto';

@Injectable()
export class SubcomService {
  constructor(
    @InjectRepository(SubcomEntity)
    private readonly subcomRepository: Repository<SubcomEntity>,
  ) {}

  async findAll(): Promise<SubcomEntity[]> {
    const subcoms = await this.subcomRepository.find();

    if (!subcoms || subcoms.length === 0) {
      throw new NotFoundException('Nenhum subcom Encontrado');
    }

    return subcoms;
  }

  async createSubcom(createSubcom: CreateSubcomDTO): Promise<SubcomEntity> {
    return this.subcomRepository.save({
      ...createSubcom,
    });
  }

  async findSubcomById(subcomId: number): Promise<SubcomEntity> {
    const subcom = await this.subcomRepository.findOne({
      where: {
        id: subcomId,
      },
    });

    if (!subcom) {
      throw new NotFoundException(`Subcom id: ${subcomId} Não Eontrado`);
    }

    return subcom;
  }

  async deleteSubcom(subcomId: number): Promise<DeleteResult> {
    await this.findSubcomById(subcomId);

    return this.subcomRepository.delete({ id: subcomId });
  }

  async updateSubcom(
    updateSubcom: UpdateSubcomDTO,
    subcomId: number,
  ): Promise<SubcomEntity> {
    const subcom = await this.findSubcomById(subcomId);

    return this.subcomRepository.save({
      ...subcom,
      ...updateSubcom,
    });
  }
}
