import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TurmaService } from '../../turma/turma.service';
import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { Repository } from 'typeorm';
import { AlunoEntity } from '../entities/aluno.entity';
import { AlunoService } from '../aluno.service';
import { createAlunoMock } from '../__mocks__/create-aluno.mock';
import { alunoMock } from '../__mocks__/aluno.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';

describe('AlunoService', () => {
  let service: AlunoService;
  let alunoRepository: Repository<AlunoEntity>;
  let turmaService: TurmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunoService,
        {
          provide: TurmaService,
          useValue: {
            findTurmaById: jest.fn().mockResolvedValue(turmaMock),
          },
        },
        {
          provide: getRepositoryToken(AlunoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([alunoMock]),
            findOne: jest.fn().mockResolvedValue(alunoMock),
            save: jest.fn().mockResolvedValue(alunoMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<AlunoService>(AlunoService);
    turmaService = module.get<TurmaService>(TurmaService);
    alunoRepository = module.get<Repository<AlunoEntity>>(
      getRepositoryToken(AlunoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(turmaService).toBeDefined();
    expect(alunoRepository).toBeDefined();
  });

  it('should return all alunos', async () => {
    const alunos = await service.findAll();

    expect(alunos).toEqual([alunoMock]);
  });

  it('should return error if alunos empty', async () => {
    jest.spyOn(alunoRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    jest.spyOn(alunoRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return alunos after insert in DB', async () => {
    const aluno = await service.createAluno(createAlunoMock);

    expect(aluno).toEqual(alunoMock);
  });

  it('should return alunos after insert in DB', async () => {
    jest.spyOn(turmaService, 'findTurmaById').mockRejectedValue(new Error());

    expect(service.createAluno(createAlunoMock)).rejects.toThrowError();
  });

  it('should return alunos in find by id', async () => {
    const aluno = await service.findAlunoById(alunoMock.id);

    expect(aluno).toEqual(alunoMock);
  });

  it('should return error in alunos not found', async () => {
    jest.spyOn(alunoRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findAlunoById(alunoMock.id)).rejects.toThrowError();
  });

  it('should return deleted true in delete alunos', async () => {
    const deleted = await service.deleteAluno(alunoMock.id);

    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return alunos after update', async () => {
    const aluno = await service.updateAluno(createAlunoMock, alunoMock.id);

    expect(aluno).toEqual(alunoMock);
  });

  it('should error in update alunos', async () => {
    jest.spyOn(alunoRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateAluno(createAlunoMock, alunoMock.id),
    ).rejects.toThrowError();
  });
});
