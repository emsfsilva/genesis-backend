import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PjesEventoService } from './pjesevento.service';
import { ReturnPjesEventoDto } from './dtos/return-pjesevento.dto';
import { CreatePjesEventoDto } from './dtos/create-pjesevento.dto';
import { User } from 'src/decorators/user.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UpdateStatusPjesEventoDto } from './dtos/update-status-pjesevento.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pjesevento')
@Roles(UserType.Master, UserType.Auxiliar)
export class PjesEventoController {
  constructor(private readonly pjeseventoService: PjesEventoService) {}

  @Post()
  async create(
    @Body() dto: CreatePjesEventoDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.create(dto, user);
  }

  @Get()
  async findAll(): Promise<ReturnPjesEventoDto[]> {
    return this.pjeseventoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePjesEventoDto: CreatePjesEventoDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.update(id, updatePjesEventoDto, user);
  }

  @Put(':id/status')
  async updateStatusEvento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusPjesEventoDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.updateStatusEvento(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: LoginPayload,
  ): Promise<void> {
    return this.pjeseventoService.remove(id, user);
  }
}
