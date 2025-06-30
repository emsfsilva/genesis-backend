import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { PjesEscalaService } from './pjesescala.service';
import { CreatePjesEscalaDto } from './dtos/create-pjesescala.dto';
import { ReturnPjesEscalaDto } from './dtos/return-pjesescala.dto';
import { UpdatePjesEscalaDto } from './dtos/update-pjesescala.dto';
import { User } from 'src/decorators/user.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { UpdateStatusPjesEscalaDto } from './dtos/update-status-pjesescala.dto';
import { UpdateObsPjesEscalaDto } from './dtos/update-obs-pjesescala.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pjesescala')
@Roles(UserType.Master, UserType.Auxiliar)
export class PjesEscalaController {
  constructor(private readonly service: PjesEscalaService) {}

  @Get('cotas')
  async getCotasPorMatricula(
    @Query('matSgp') matSgp: number,
    @Query('ano') ano: number,
    @Query('mes') mes: number,
  ) {
    return this.service.getCotasDetalhadasPorMatricula(matSgp, ano, mes);
  }

  @Get('quantidade')
  async getQuantidadePorMatriculaAnoMes(
    @Query('matSgp') matSgp: number,
    @Query('ano') ano: number,
    @Query('mes') mes: number,
  ): Promise<number> {
    return this.service.getQuantidadePorMatriculaAnoMes(matSgp, ano, mes);
  }

  @Post()
  async create(
    @Body() dto: CreatePjesEscalaDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEscalaDto> {
    const created = await this.service.create(dto, user);
    return new ReturnPjesEscalaDto(created);
  }

  @Get()
  async findAll(
    @Query('operacaoId') operacaoId?: number,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
  ): Promise<ReturnPjesEscalaDto[]> {
    const escalas = await this.service.findAll(operacaoId, ano, mes);
    return escalas.map((e) => new ReturnPjesEscalaDto(e));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnPjesEscalaDto> {
    const escala = await this.service.findOne(id);
    return new ReturnPjesEscalaDto(escala);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePjesEscalaDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEscalaDto> {
    const updated = await this.service.update(id, dto, user);
    return new ReturnPjesEscalaDto(updated);
  }

  @Put(':id/status')
  async updateStatusEscala(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusPjesEscalaDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEscalaDto> {
    return this.service.updateStatusEscala(id, dto, user);
  }

  @Put(':id/obs')
  updateObs(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateObsPjesEscalaDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEscalaDto> {
    return this.service.registrarObs(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: LoginPayload,
  ): Promise<void> {
    return this.service.remove(id, user);
  }
}
