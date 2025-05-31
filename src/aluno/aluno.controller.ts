import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateAlunoDTO } from './dtos/create-aluno.dto';
import { ReturnAlunoDTO } from './dtos/return-aluno.dto';
import { UpdateAlunoDTO } from './dtos/update-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';
import { AlunoService } from './aluno.service';
import { UpdateResponsaveisDTO } from './dtos/update-responsaveis.dto';
import { AlunoTurmaTotalDTO } from './dtos/alunoturma-total.dto';

@Controller('aluno')
/*@Roles(
  UserType.Master,
  UserType.Comando,
  UserType.CmtCa,
  UserType.CmtCia,
  UserType.Adm,
  UserType.Monitor,
  UserType.Aluno,
)
  
@UsePipes(ValidationPipe)
*/
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Get()
  async findAll(): Promise<ReturnAlunoDTO[]> {
    return (await this.alunoService.findAll()).map(
      (aluno) => new ReturnAlunoDTO(aluno),
    );
  }

  @Post()
  async createAluno(@Body() createAluno: CreateAlunoDTO): Promise<AlunoEntity> {
    return this.alunoService.createAluno(createAluno);
  }

  @Get('sem-turma')
  async findAlunosSemTurma(): Promise<ReturnAlunoDTO[]> {
    const alunos = await this.alunoService.findAlunosSemTurma();
    return alunos.map((aluno) => new ReturnAlunoDTO(aluno));
  }

  @Get('/:alunoId')
  async getAlunoById(
    @Param('alunoId') alunoId: number,
  ): Promise<ReturnAlunoDTO> {
    return this.alunoService.findAlunoById(alunoId);
  }

  @Get('por-user/:userId')
  async findAlunoByUserId(@Param('userId') userId: number) {
    return this.alunoService.findAlunoByUserId(userId);
  }

  @Delete('/:alunoId')
  async deleteAluno(@Param('alunoId') alunoId: number): Promise<DeleteResult> {
    return this.alunoService.deleteAluno(alunoId);
  }

  @Put('/:alunoId')
  async updateAluno(
    @Body() updateAluno: UpdateAlunoDTO,
    @Param('alunoId') alunoId: number,
  ): Promise<AlunoEntity> {
    return this.alunoService.updateAluno(updateAluno, alunoId);
  }

  @Put('/:alunoId/responsaveis')
  async updateResponsaveis(
    @Param('alunoId') alunoId: number,
    @Body() updateResponsaveis: UpdateResponsaveisDTO,
  ): Promise<AlunoEntity> {
    return this.alunoService.updateResponsaveis(alunoId, updateResponsaveis);
  }

  // aluno.controller.ts

  @Get('por-responsavel/:id')
  async getAlunosPorResponsavel(
    @Param('id') id: number,
  ): Promise<ReturnAlunoDTO[]> {
    const alunos = await this.alunoService.findAlunosPorResponsavel(id);
    return alunos.map((aluno) => new ReturnAlunoDTO(aluno));
  }

  @Get('/alunoturma/totais')
  async getAlunoTurmaTotais(): Promise<AlunoTurmaTotalDTO> {
    return this.alunoService.getAlunoTurmaTotais();
  }
}
