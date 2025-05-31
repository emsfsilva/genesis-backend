import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { TurmaService } from './turma.service';
import { CreateTurma } from './dtos/create-turma.dto';
import { ReturnTurma } from './dtos/return-turma.dto';
import { TurmaEntity } from './entities/turma.entity';
import { Param, Patch } from '@nestjs/common';

/*
  @Roles(
    UserType.Master,
    UserType.Comando,
    UserType.CmtCa,
    UserType.CmtCia,
    UserType.Adm,
    UserType.Monitor,
    UserType.Aluno,
  )
*/
//@UsePipes(ValidationPipe)
@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Get()
  async findAllTurmas(): Promise<ReturnTurma[]> {
    return (await this.turmaService.findAllTurmas()).map(
      (turma) => new ReturnTurma(turma),
    );
  }

  @Get('/:turmaId')
  async getTurmaById(@Param('turmaId') turmaId: number): Promise<ReturnTurma> {
    const turma = await this.turmaService.findTurmaById(turmaId);
    return new ReturnTurma(turma);
  }

  @Post()
  async createTurma(@Body() createTurma: CreateTurma): Promise<TurmaEntity> {
    return this.turmaService.createTurma(createTurma);
  }

  @Patch(':turmaId/adicionar-aluno/:alunoId')
  async adicionarAluno(
    @Param('turmaId') turmaId: number,
    @Param('alunoId') alunoId: number,
  ) {
    await this.turmaService.adicionarAlunoNaTurma(turmaId, alunoId);
  }

  @Patch('remover-aluno/:alunoId')
  async removerAluno(@Param('alunoId') alunoId: number) {
    await this.turmaService.removerAlunoDaTurma(alunoId);
  }
}
