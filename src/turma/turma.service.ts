import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTurma } from './dtos/create-turma.dto';
import { TurmaEntity } from './entities/turma.entity';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';

@Injectable()
export class TurmaService {
  constructor(
    @InjectRepository(TurmaEntity)
    private readonly turmaRepository: Repository<TurmaEntity>,
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,
  ) {}

  async findAllTurmas(): Promise<TurmaEntity[]> {
    const turmas = await this.turmaRepository.find({
      relations: {
        cia: true,
        alunos: true,
      },
    });

    if (!turmas || turmas.length === 0) {
      throw new NotFoundException('Turma Vazia');
    }

    return turmas;
  }

  async findTurmaById(turmaId: number): Promise<TurmaEntity> {
    const turma = await this.turmaRepository.findOne({
      where: {
        id: turmaId,
      },
      relations: {
        cia: true,
        alunos: {
          user: true,
          turma: {
            cia: true,
          },
        },
      },
    });

    if (!turma) {
      throw new NotFoundException(`Turma id: ${turmaId} não encontrada`);
    }

    return turma;
  }

  async findTurmaByName(name: string): Promise<TurmaEntity> {
    const turma = await this.turmaRepository.findOne({
      where: {
        name,
      },
    });

    if (!turma) {
      throw new NotFoundException(`Turma Nome ${name} não encotrado`);
    }

    return turma;
  }

  async createTurma(createTurma: CreateTurma): Promise<TurmaEntity> {
    const turma = await this.findTurmaByName(createTurma.name).catch(
      () => undefined,
    );

    if (turma) {
      throw new BadRequestException(`Turma name ${createTurma.name} exist`);
    }

    return this.turmaRepository.save(createTurma);
  }

  async adicionarAlunoNaTurma(turmaId: number, alunoId: number): Promise<void> {
    const turma = await this.findTurmaById(turmaId);
    const aluno = await this.alunoRepository.findOneBy({ id: alunoId });

    if (!aluno) {
      throw new NotFoundException(`Aluno id: ${alunoId} não encontrado`);
    }

    aluno.turma = turma;
    await this.alunoRepository.save(aluno);
  }

  async removerAlunoDaTurma(alunoId: number): Promise<void> {
    const aluno = await this.alunoRepository.findOneBy({ id: alunoId });

    if (!aluno) {
      throw new NotFoundException(`Aluno id: ${alunoId} não encontrado`);
    }

    aluno.turma = null; // Remove o relacionamento
    await this.alunoRepository.save(aluno);
  }

  async countTurmas(): Promise<number> {
    return this.turmaRepository.count();
  }
}
