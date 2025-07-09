import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePjesTetoDto } from './dtos/create-pjesteto.dto';
import { ReturnPjesTetoDto } from './dtos/return-pjesteto.dto';
import { PjesTetoService } from './pjesteto.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserType } from 'src/user/enum/user-type.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('pjesteto')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.Master, UserType.Auxiliar, UserType.Diretor)
export class PjesTetoController {
  constructor(private readonly pjestetoService: PjesTetoService) {}

  @Post()
  async create(@Body() dto: CreatePjesTetoDto): Promise<ReturnPjesTetoDto> {
    return this.pjestetoService.create(dto);
  }

  @Get()
  async findAll(
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
  ): Promise<ReturnPjesTetoDto[]> {
    return this.pjestetoService.findAll(ano, mes);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ReturnPjesTetoDto> {
    return this.pjestetoService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: CreatePjesTetoDto,
  ): Promise<ReturnPjesTetoDto> {
    return this.pjestetoService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.pjestetoService.remove(id);
  }
}
