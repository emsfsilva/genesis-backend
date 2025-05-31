import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmtciaEntity } from '../entities/cmtcia.entity';
import { CmtciaService } from '../cmtcia.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { cmtciaMock } from '../__mocks__/cmtcia.mock';
import { createCmtciaMock } from '../__mocks__/create-cmtcia.mock';

describe('CmtciaService', () => {
  let service: CmtciaService;
  let cmtciaRepository: Repository<CmtciaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();

    service = module.get<CmtciaService>(CmtciaService);
    cmtciaRepository = module.get<Repository<CmtciaEntity>>(
      getRepositoryToken(CmtciaEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cmtciaRepository).toBeDefined();
  });

  it('should return all Cmtcia', async () => {
    const cmtcias = await service.findAll();

    expect(cmtcias).toEqual([cmtciaMock]);
  });

  it('should return error if cmtcias empty', async () => {
    jest.spyOn(cmtciaRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    jest.spyOn(cmtciaRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return alunos after insert in DB', async () => {
    const cmtcia = await service.createCmtcia(createCmtciaMock);

    expect(cmtcia).toEqual(cmtciaMock);
  });

  it('should return cmtcias in find by id', async () => {
    const cmtcia = await service.findCmtciaById(cmtciaMock.id);

    expect(cmtcia).toEqual(cmtciaMock);
  });

  it('should return error in alunos not found', async () => {
    jest.spyOn(cmtciaRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCmtciaById(cmtciaMock.id)).rejects.toThrowError();
  });

  it('should return deleted true in delete Cmtcias', async () => {
    const deleted = await service.deleteCmtcia(cmtciaMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return Cmtcias after update', async () => {
    const cmtcia = await service.updateCmtcia(createCmtciaMock, cmtciaMock.id);

    expect(cmtcia).toEqual(cmtciaMock);
  });

  it('should error in update cmtcias', async () => {
    jest.spyOn(cmtciaRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateCmtcia(createCmtciaMock, cmtciaMock.id),
    ).rejects.toThrowError();
  });
});
