import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmEntity } from '../entities/adm.entity';
import { AdmService } from '../adm.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { admMock } from '../__mocks__/adm.mock';
import { createAdmMock } from '../__mocks__/create-adm.mock';

describe('AdmService', () => {
  let service: AdmService;
  let admRepository: Repository<AdmEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();

    service = module.get<AdmService>(AdmService);
    admRepository = module.get<Repository<AdmEntity>>(
      getRepositoryToken(AdmEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(admRepository).toBeDefined();
  });

  it('should return all Adm', async () => {
    const adms = await service.findAll();

    expect(adms).toEqual([admMock]);
  });

  it('should return error if Adms empty', async () => {
    jest.spyOn(admRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    jest.spyOn(admRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return alunos after insert in DB', async () => {
    const adm = await service.createAdm(createAdmMock);

    expect(adm).toEqual(admMock);
  });

  it('should return adms in find by id', async () => {
    const adm = await service.findAdmById(admMock.id);

    expect(adm).toEqual(admMock);
  });

  it('should return error in alunos not found', async () => {
    jest.spyOn(admRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findAdmById(admMock.id)).rejects.toThrowError();
  });

  it('should return deleted true in delete Adms', async () => {
    const deleted = await service.deleteAdm(admMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return Adms after update', async () => {
    const adm = await service.updateAdm(createAdmMock, admMock.id);

    expect(adm).toEqual(admMock);
  });

  it('should error in update Adms', async () => {
    jest.spyOn(admRepository, 'save').mockRejectedValue(new Error());

    expect(service.updateAdm(createAdmMock, admMock.id)).rejects.toThrowError();
  });
});
