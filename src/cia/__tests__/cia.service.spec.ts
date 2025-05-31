import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiaService } from '../cia.service';
import { CiaEntity } from '../entities/cia.entity';
import { ciaMock } from '../__mocks__/cia.mock';
import { createCiaMock } from '../__mocks__/create-cia.mock';

describe('CiaService', () => {
  let service: CiaService;
  let ciaRepository: Repository<CiaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CiaService,
        {
          provide: getRepositoryToken(CiaEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(ciaMock),
            find: jest.fn().mockResolvedValue([ciaMock]),
            save: jest.fn().mockResolvedValue(ciaMock),
          },
        },
      ],
    }).compile();

    service = module.get<CiaService>(CiaService);
    ciaRepository = module.get<Repository<CiaEntity>>(
      getRepositoryToken(CiaEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ciaRepository).toBeDefined();
  });

  it('should return list cia', async () => {
    const cias = await service.findAllCias();

    expect(cias).toEqual([ciaMock]);
  });

  it('should return error in list Cia empty', async () => {
    jest.spyOn(ciaRepository, 'find').mockResolvedValue([]);

    expect(service.findAllCias()).rejects.toThrowError();
  });

  it('should return error in list cia exception', async () => {
    jest.spyOn(ciaRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCias()).rejects.toThrowError();
  });

  it('should return error if exist cia name', async () => {
    expect(service.createCia(createCiaMock)).rejects.toThrowError();
  });

  it('should return cia after save', async () => {
    jest.spyOn(ciaRepository, 'findOne').mockResolvedValue(undefined);

    const cia = await service.createCia(createCiaMock);

    expect(cia).toEqual(ciaMock);
  });

  it('should return error in exception', async () => {
    jest.spyOn(ciaRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCia(createCiaMock)).rejects.toThrowError();
  });

  it('should return cia in find by name', async () => {
    const cia = await service.findCiaByName(ciaMock.name);

    expect(cia).toEqual(ciaMock);
  });

  it('should return error if cia find by name empty', async () => {
    jest.spyOn(ciaRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCiaByName(ciaMock.name)).rejects.toThrowError();
  });

  it('should return cia in find by id', async () => {
    const cia = await service.findCiaById(ciaMock.id);

    expect(cia).toEqual(ciaMock);
  });

  it('should return error in not found cia id', async () => {
    jest.spyOn(ciaRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCiaById(ciaMock.id)).rejects.toThrowError();
  });
});
