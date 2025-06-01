import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PjesEventoService } from './pjesevento.service';
import { ReturnPjesEventoDto } from './dtos/return-pjesevento.dto';
import { CreatePjesEventoDto } from './dtos/create-pjesevento.dto';

@Controller('pjesevento')
export class PjesEventoController {
  constructor(private readonly pjeseventoService: PjesEventoService) {}

  @Post()
  create(
    @Body() createPjesEventoDto: CreatePjesEventoDto,
  ): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.create(createPjesEventoDto);
  }

  @Get()
  findAll(): Promise<ReturnPjesEventoDto[]> {
    return this.pjeseventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updatePjesEventoDto: CreatePjesEventoDto,
  ): Promise<ReturnPjesEventoDto> {
    return this.pjeseventoService.update(id, updatePjesEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.pjeseventoService.remove(id);
  }
}
