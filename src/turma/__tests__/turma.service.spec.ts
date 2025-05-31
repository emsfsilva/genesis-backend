import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TurmaService } from '../turma.service';
import { TurmaEntity } from '../entities/turma.entity';
import { turmaMock } from '../__mocks__/turma.mock';
import { createTurmaMock } from '../__mocks__/create-turma.mock';

describe('TurmaService', () => {
  let service: TurmaService;
  let turmaRepository: Repository<TurmaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurmaService,
        {
          provide: getRepositoryToken(TurmaEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(turmaMock),
            find: jest.fn().mockResolvedValue([turmaMock]),
            save: jest.fn().mockResolvedValue(turmaMock),
          },
        },
      ],
    }).compile();

    service = module.get<TurmaService>(TurmaService);
    turmaRepository = module.get<Repository<TurmaEntity>>(
      getRepositoryToken(TurmaEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(turmaRepository).toBeDefined();
  });

  it('should return list turma', async () => {
    const turmas = await service.findAllTurmas();

    expect(turmas).toEqual([turmaMock]);
  });

  it('should return error in list turma empty', async () => {
    jest.spyOn(turmaRepository, 'find').mockResolvedValue([]);

    expect(service.findAllTurmas()).rejects.toThrowError();
  });

  it('should return error in list turma exception', async () => {
    jest.spyOn(turmaRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllTurmas()).rejects.toThrowError();
  });

  it('should return error if exist turma name', async () => {
    expect(service.createTurma(createTurmaMock)).rejects.toThrowError();
  });

  it('should return turma after save', async () => {
    jest.spyOn(turmaRepository, 'findOne').mockResolvedValue(undefined);

    const turma = await service.createTurma(createTurmaMock);

    expect(turma).toEqual(turmaMock);
  });

  it('should return error in exception', async () => {
    jest.spyOn(turmaRepository, 'save').mockRejectedValue(new Error());

    expect(service.createTurma(createTurmaMock)).rejects.toThrowError();
  });

  it('should return turma in find by name', async () => {
    const turma = await service.findTurmaByName(turmaMock.name);

    expect(turma).toEqual(turmaMock);
  });

  it('should return error if turma find by name empty', async () => {
    jest.spyOn(turmaRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findTurmaByName(turmaMock.name)).rejects.toThrowError();
  });

  it('should return turma in find by id', async () => {
    const turma = await service.findTurmaById(turmaMock.id);

    expect(turma).toEqual(turmaMock);
  });

  it('should return error in not found turma id', async () => {
    jest.spyOn(turmaRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findTurmaById(turmaMock.id)).rejects.toThrowError();
  });
});
