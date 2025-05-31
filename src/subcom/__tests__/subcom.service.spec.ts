import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubcomEntity } from '../entities/subcom.entity';
import { SubcomService } from '../subcom.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { subcomMock } from '../__mocks__/subcom.mock';
import { createSubcomMock } from '../__mocks__/create-subcom.mock';

describe('SubcomService', () => {
  let service: SubcomService;
  let subcomRepository: Repository<SubcomEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();

    service = module.get<SubcomService>(SubcomService);
    subcomRepository = module.get<Repository<SubcomEntity>>(
      getRepositoryToken(SubcomEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(subcomRepository).toBeDefined();
  });

  it('should return all Subcom', async () => {
    const subcoms = await service.findAll();

    expect(subcoms).toEqual([subcomMock]);
  });

  it('should return error if Subcoms empty', async () => {
    jest.spyOn(subcomRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    jest.spyOn(subcomRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return subcom after insert in DB', async () => {
    const subcom = await service.createSubcom(createSubcomMock);

    expect(subcom).toEqual(subcomMock);
  });

  it('should return subcoms in find by id', async () => {
    const subcom = await service.findSubcomById(subcomMock.id);

    expect(subcom).toEqual(subcomMock);
  });

  it('should return error in Subcoms not found', async () => {
    jest.spyOn(subcomRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findSubcomById(subcomMock.id)).rejects.toThrowError();
  });

  it('should return deleted true in delete Subcom', async () => {
    const deleted = await service.deleteSubcom(subcomMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return Subcom after update', async () => {
    const subcom = await service.updateSubcom(createSubcomMock, subcomMock.id);

    expect(subcom).toEqual(subcomMock);
  });

  it('should error in update Subcoms', async () => {
    jest.spyOn(subcomRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateSubcom(createSubcomMock, subcomMock.id),
    ).rejects.toThrowError();
  });
});
