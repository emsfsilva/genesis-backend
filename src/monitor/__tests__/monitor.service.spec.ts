import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonitorEntity } from '../entities/monitor.entity';
import { MonitorService } from '../monitor.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { monitorMock } from '../__mocks__/monitor.mock';
import { createMonitorMock } from '../__mocks__/create-monitor.mock';

describe('MonitorService', () => {
  let service: MonitorService;
  let monitorRepository: Repository<MonitorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();

    service = module.get<MonitorService>(MonitorService);
    monitorRepository = module.get<Repository<MonitorEntity>>(
      getRepositoryToken(MonitorEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(monitorRepository).toBeDefined();
  });

  it('should return all monitor', async () => {
    const monitores = await service.findAll();

    expect(monitores).toEqual([monitorMock]);
  });

  it('should return error if monitors empty', async () => {
    jest.spyOn(monitorRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    jest.spyOn(monitorRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return alunos after insert in DB', async () => {
    const monitor = await service.createMonitor(createMonitorMock);

    expect(monitor).toEqual(monitorMock);
  });

  it('should return monitors in find by id', async () => {
    const monitor = await service.findMonitorById(monitorMock.id);

    expect(monitor).toEqual(monitorMock);
  });

  it('should return error in alunos not found', async () => {
    jest.spyOn(monitorRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findMonitorById(monitorMock.id)).rejects.toThrowError();
  });

  it('should return deleted true in delete monitors', async () => {
    const deleted = await service.deleteMonitor(monitorMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return monitors after update', async () => {
    const monitor = await service.updateMonitor(
      createMonitorMock,
      monitorMock.id,
    );

    expect(monitor).toEqual(monitorMock);
  });

  it('should error in update monitors', async () => {
    jest.spyOn(monitorRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateMonitor(createMonitorMock, monitorMock.id),
    ).rejects.toThrowError();
  });
});
