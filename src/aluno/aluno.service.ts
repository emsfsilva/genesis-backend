import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurmaService } from '../turma/turma.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAlunoDTO } from './dtos/create-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';
import { UpdateAlunoDTO } from './dtos/update-aluno.dto';
import { ReturnAlunoDTO } from './dtos/return-aluno.dto';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { UpdateResponsaveisDTO } from './dtos/update-responsaveis.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { BadRequestException } from '@nestjs/common'; // Já deve estar importado
import { AlunoTurmaTotalDTO } from './dtos/alunoturma-total.dto';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(ComunicacaoEntity)
    private readonly comunicacaoRepository: Repository<ComunicacaoEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly turmaService: TurmaService,
  ) {}

  //Metodo para calcular o grau do Aluno em tempo REAL
  async calcularGrauAtual(userIdAl: number): Promise<number> {
    const aluno = await this.alunoRepository.findOne({
      where: { userId: userIdAl },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const resultado = await this.comunicacaoRepository
      .createQueryBuilder('comunicacao')
      .select('SUM(comunicacao.grauMotivo)', 'soma')
      .where('comunicacao.userIdAl = :userIdAl', { userIdAl })
      //andWhere: adiciona mais condições (como se fosse AND no SQL)
      .andWhere('comunicacao.status = :status', {
        status: 'Comunicação publicada',
      })
      .getRawOne();

    const somaGrauMotivo = parseFloat(resultado.soma) || 0;

    return aluno.grauInicial - somaGrauMotivo;
  }

  async findAll(): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      relations: {
        user: true,
        turma: {
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
      },
    });

    if (!alunos || alunos.length === 0) {
      throw new NotFoundException('Nenhum Aluno Encontrado');
    }

    return alunos;
  }

  async createAluno(createAluno: CreateAlunoDTO): Promise<AlunoEntity> {
    await this.turmaService.findTurmaById(createAluno.turmaId);

    return this.alunoRepository.save({
      ...createAluno,
    });
  }

  async findAlunoById(alunoId: number): Promise<ReturnAlunoDTO> {
    const aluno = await this.alunoRepository.findOne({
      where: {
        id: alunoId,
      },
      relations: {
        user: true,
        turma: {
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno id: ${alunoId} Não Encontrado`);
    }

    const grauAtual = await this.calcularGrauAtual(aluno.userId);

    return new ReturnAlunoDTO(aluno, grauAtual);
  }

  async findAlunoByUserId(userId: number): Promise<ReturnAlunoDTO> {
    const aluno = await this.alunoRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        turma: {
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com userId: ${userId} não encontrado`);
    }

    const grauAtual = await this.calcularGrauAtual(userId);

    return new ReturnAlunoDTO(aluno, grauAtual);
  }

  async findAlunosPorResponsavel(respId: number): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      where: [{ resp1: respId }, { resp2: respId }],
      relations: {
        user: true,
        turma: {
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
      },
    });

    if (!alunos || alunos.length === 0) {
      throw new NotFoundException(
        'Nenhum aluno encontrado para este responsável',
      );
    }

    return alunos;
  }

  async deleteAluno(alunoId: number): Promise<DeleteResult> {
    await this.findAlunoById(alunoId);

    return this.alunoRepository.delete({ id: alunoId });
  }

  async updateAluno(
    updateAluno: UpdateAlunoDTO,
    alunoId: number,
  ): Promise<AlunoEntity> {
    const aluno = await this.findAlunoById(alunoId);

    return this.alunoRepository.save({
      ...aluno,
      ...updateAluno,
    });
  }

  async findAlunosSemTurma(): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      where: {
        turmaId: 1,
      },
      relations: {
        user: true,
      },
    });

    if (!alunos || alunos.length === 0) {
      throw new NotFoundException('Nenhum aluno disponível sem turma');
    }

    return alunos;
  }

  async updateResponsaveis(
    alunoId: number,
    { resp1, resp2 }: UpdateResponsaveisDTO,
  ): Promise<AlunoEntity> {
    const aluno = await this.alunoRepository.findOne({
      where: { id: alunoId },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const resp1User = await this.userRepository.findOne({
      where: { id: resp1 },
    });
    const resp2User = await this.userRepository.findOne({
      where: { id: resp2 },
    });

    if (!resp1User || !resp2User) {
      throw new BadRequestException('Responsável 1 ou 2 inválido');
    }

    aluno.resp1 = resp1;
    aluno.resp2 = resp2;

    return this.alunoRepository.save(aluno);
  }

  async getAlunoTurmaTotais(): Promise<AlunoTurmaTotalDTO> {
    const totalTurmas = await this.turmaService.countTurmas();
    const totalAlunos = await this.alunoRepository.count();
    const totalAlunosSemTurma = await this.alunoRepository.count({
      where: {
        turmaId: null,
      },
    });

    console.log({
      totalTurmas,
      totalAlunos,
      totalAlunosSemTurma,
    });

    return new AlunoTurmaTotalDTO(
      totalTurmas,
      totalAlunos,
      totalAlunosSemTurma,
    );
  }
}
