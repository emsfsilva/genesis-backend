import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { CreateMonitorDTO } from './dtos/create-monitor.dto';
import { UpdateMonitorDTO } from './dtos/update-monitor.dto';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
  ) {}

  async findAll(): Promise<MonitorEntity[]> {
    const monitores = await this.monitorRepository.find({
      relations: {
        cia: true,
      },
    });

    if (!monitores || monitores.length === 0) {
      throw new NotFoundException('Nenhum monitor Encontrado');
    }

    return monitores;
  }

  async createMonitor(createMonitor: CreateMonitorDTO): Promise<MonitorEntity> {
    return this.monitorRepository.save({
      ...createMonitor,
    });
  }

  async findMonitorById(monitorId: number): Promise<MonitorEntity> {
    const monitor = await this.monitorRepository.findOne({
      where: {
        id: monitorId,
      },
    });

    if (!monitor) {
      throw new NotFoundException(`monitor id: ${monitorId} Não Eontrado`);
    }

    return monitor;
  }

  async deleteMonitor(monitorId: number): Promise<DeleteResult> {
    await this.findMonitorById(monitorId);

    return this.monitorRepository.delete({ id: monitorId });
  }

  async updateMonitor(
    updateMonitor: UpdateMonitorDTO,
    monitorId: number,
  ): Promise<MonitorEntity> {
    const monitor = await this.findMonitorById(monitorId);

    return this.monitorRepository.save({
      ...monitor,
      ...updateMonitor,
    });
  }
}
