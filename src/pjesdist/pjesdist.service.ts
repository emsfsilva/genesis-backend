import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PjesDistEntity } from './entities/pjesdist.entity';
import { CreatePjesDistDto } from './dtos/create-pjesdist.dto';
import { ReturnPjesDistDto } from './dtos/return-pjesdist.dto';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { PjesTetoEntity } from 'src/pjesteto/entities/pjesteto.entity';

@Injectable()
export class PjesDistService {
  constructor(
    @InjectRepository(PjesDistEntity)
    private readonly pjesDistRepository: Repository<PjesDistEntity>,

    @InjectRepository(PjesTetoEntity)
    private readonly pjesTetoRepository: Repository<PjesTetoEntity>,
  ) {}

  async create(
    data: CreatePjesDistDto,
    user: LoginPayload,
  ): Promise<ReturnPjesDistDto> {
    const teto = await this.pjesTetoRepository.findOne({
      where: { id: data.pjesTetoId },
    });

    if (!teto) {
      throw new NotFoundException('Verba não encontrada.');
    }

    const dist = this.pjesDistRepository.create({
      ...data,
      codVerba: teto.codVerba,
    });

    const saved = await this.pjesDistRepository.save(dist);

    const full = await this.pjesDistRepository.findOne({
      where: { id: saved.id },
      relations: ['pjeseventos'],
    });

    return new ReturnPjesDistDto(full);
  }

  async update(
    id: number,
    data: Partial<CreatePjesDistDto>,
    user: LoginPayload,
  ): Promise<ReturnPjesDistDto> {
    const existing = await this.pjesDistRepository.findOne({
      where: { id },
      relations: ['pjeseventos'],
    });

    if (!existing) {
      throw new NotFoundException('Distribuição não encontrada');
    }

    // ✅ Impede troca de teto
    if (data.pjesTetoId && data.pjesTetoId !== existing.pjesTetoId) {
      throw new BadRequestException(
        'Não é permitido alterar o tipo da verba ja criada.',
      );
    }

    const totalOfDistribuido =
      existing.pjeseventos?.reduce((sum, ev) => sum + ev.ttCtOfEvento, 0) ?? 0;

    const totalPrcDistribuido =
      existing.pjeseventos?.reduce((sum, ev) => sum + ev.ttCtPrcEvento, 0) ?? 0;

    if (data.ttCtOfDist !== undefined && data.ttCtOfDist < totalOfDistribuido) {
      throw new BadRequestException(
        `Nova cota de oficiais (${data.ttCtOfDist}) é menor que o total já distribuído (${totalOfDistribuido}).`,
      );
    }

    if (
      data.ttCtPrcDist !== undefined &&
      data.ttCtPrcDist < totalPrcDistribuido
    ) {
      throw new BadRequestException(
        `Nova cota de praças (${data.ttCtPrcDist}) é menor que o total já distribuído (${totalPrcDistribuido}).`,
      );
    }

    // 🔒 Remove pjesTetoId para garantir que não será alterado
    delete data.pjesTetoId;

    const updated = this.pjesDistRepository.merge(existing, data);
    const saved = await this.pjesDistRepository.save(updated);

    const full = await this.pjesDistRepository.findOne({
      where: { id: saved.id },
      relations: ['pjeseventos'],
    });

    return new ReturnPjesDistDto(full);
  }

  async findAll(): Promise<ReturnPjesDistDto[]> {
    const dists = await this.pjesDistRepository.find({
      relations: ['pjeseventos'],
    });

    return dists.map((dist) => new ReturnPjesDistDto(dist));
  }

  async findOne(id: number): Promise<ReturnPjesDistDto> {
    const dist = await this.pjesDistRepository.findOne({
      where: { id },
      relations: ['pjeseventos'],
    });

    if (!dist) {
      throw new NotFoundException('Distribuição não encontrada');
    }

    return new ReturnPjesDistDto(dist);
  }

  async remove(id: number, user: LoginPayload): Promise<void> {
    const dist = await this.pjesDistRepository.findOne({
      where: { id },
      relations: ['pjeseventos'],
    });

    if (!dist) {
      throw new NotFoundException('Distribuição não encontrada');
    }

    if (dist.pjeseventos && dist.pjeseventos.length > 0) {
      throw new BadRequestException(
        'Não é possível remover: existem eventos associados.',
      );
    }

    await this.pjesDistRepository.remove(dist);
  }
}
