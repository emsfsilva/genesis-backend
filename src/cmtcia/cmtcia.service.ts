import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CmtciaEntity } from './entities/cmtcia.entity';
import { CreateCmtciaDTO } from './dtos/create-cmtcia.dto';
import { UpdateCmtciaDTO } from './dtos/update-cmtcia.dto';

@Injectable()
export class CmtciaService {
  constructor(
    @InjectRepository(CmtciaEntity)
    private readonly cmtciaRepository: Repository<CmtciaEntity>,
  ) {}

  async findAll(): Promise<CmtciaEntity[]> {
    const cmtcias = await this.cmtciaRepository.find({
      relations: {
        cia: true,
      },
    });

    if (!cmtcias || cmtcias.length === 0) {
      throw new NotFoundException('Nenhum cmtcia Encontrado');
    }

    return cmtcias;
  }

  async createCmtcia(createCmtcia: CreateCmtciaDTO): Promise<CmtciaEntity> {
    return this.cmtciaRepository.save({
      ...createCmtcia,
    });
  }

  async findCmtciaById(cmtciaId: number): Promise<CmtciaEntity> {
    const cmtcia = await this.cmtciaRepository.findOne({
      where: {
        id: cmtciaId,
      },
    });

    if (!cmtcia) {
      throw new NotFoundException(`cmtcia id: ${cmtciaId} Não Eontrado`);
    }

    return cmtcia;
  }

  async deleteCmtcia(cmtciaId: number): Promise<DeleteResult> {
    await this.findCmtciaById(cmtciaId);

    return this.cmtciaRepository.delete({ id: cmtciaId });
  }

  async updateCmtcia(
    updateCmtcia: UpdateCmtciaDTO,
    cmtciaId: number,
  ): Promise<CmtciaEntity> {
    const cmtcia = await this.findCmtciaById(cmtciaId);

    return this.cmtciaRepository.save({
      ...cmtcia,
      ...updateCmtcia,
    });
  }
}
