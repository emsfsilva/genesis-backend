import { ReturnCia } from 'src/cia/dtos/return-cia.dto';
import { MonitorEntity } from '../entities/monitor.entity';

export class ReturnMonitorDTO {
  id: number;
  userId: number;
  cia?: ReturnCia;

  constructor(monitorEntity: MonitorEntity) {
    this.id = monitorEntity.id;
    this.userId = monitorEntity.userId;
    this.cia = monitorEntity.cia ? new ReturnCia(monitorEntity.cia) : undefined;
  }
}
