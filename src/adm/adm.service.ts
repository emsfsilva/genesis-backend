import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AdmEntity } from './entities/adm.entity';
import { CreateAdmDTO } from './dtos/create-adm.dto';
import { UpdateAdmDTO } from './dtos/update-adm.dto';

@Injectable()
export class AdmService {
  constructor(
    @InjectRepository(AdmEntity)
    private readonly admRepository: Repository<AdmEntity>,
  ) {}

  async findAll(): Promise<AdmEntity[]> {
    const adms = await this.admRepository.find({
      relations: {
        cia: true,
      },
    });

    if (!adms || adms.length === 0) {
      throw new NotFoundException('Nenhum Adm Encontrado');
    }

    return adms;
  }

  async createAdm(createAdm: CreateAdmDTO): Promise<AdmEntity> {
    return this.admRepository.save({
      ...createAdm,
    });
  }

  async findAdmById(admId: number): Promise<AdmEntity> {
    const adm = await this.admRepository.findOne({
      where: {
        id: admId,
      },
    });

    if (!adm) {
      throw new NotFoundException(`Adm id: ${admId} Não Eontrado`);
    }

    return adm;
  }

  async deleteAdm(admId: number): Promise<DeleteResult> {
    await this.findAdmById(admId);

    return this.admRepository.delete({ id: admId });
  }

  async updateAdm(updateAdm: UpdateAdmDTO, admId: number): Promise<AdmEntity> {
    const adm = await this.findAdmById(admId);

    return this.admRepository.save({
      ...adm,
      ...updateAdm,
    });
  }
}
