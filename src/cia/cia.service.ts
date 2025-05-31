import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCia } from './dtos/create-cia.dto';
import { CiaEntity } from './entities/cia.entity';

@Injectable()
export class CiaService {
  constructor(
    @InjectRepository(CiaEntity)
    private readonly ciaRepository: Repository<CiaEntity>,
  ) {}

  async findAllCias(): Promise<CiaEntity[]> {
    const cias = await this.ciaRepository.find();

    if (!cias || cias.length === 0) {
      throw new NotFoundException('Cia Vazia');
    }

    return cias;
  }

  async findCiaById(ciaId: number): Promise<CiaEntity> {
    const cia = await this.ciaRepository.findOne({
      where: {
        id: ciaId,
      },
    });

    if (!cia) {
      throw new NotFoundException(`Cia id: ${ciaId} não encontrada`);
    }

    return cia;
  }

  async findCiaByName(name: string): Promise<CiaEntity> {
    const cia = await this.ciaRepository.findOne({
      where: {
        name,
      },
    });

    if (!cia) {
      throw new NotFoundException(`Cia Nome ${name} não encotrada`);
    }

    return cia;
  }

  async createCia(createCia: CreateCia): Promise<CiaEntity> {
    const cia = await this.findCiaByName(createCia.name).catch(() => undefined);

    if (cia) {
      throw new BadRequestException(`Cia name ${createCia.name} exist`);
    }

    return this.ciaRepository.save(createCia);
  }
}
