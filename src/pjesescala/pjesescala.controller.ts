import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PjesEscalaService } from './pjesescala.service';
import { CreatePjesEscalaDto } from './dtos/create-pjesescala.dto';
import { ReturnPjesEscalaDto } from './dtos/return-pjesescala.dto';
import { UpdatePjesEscalaDto } from './dtos/update-pjesescala.dto';

@Controller('pjes-escala')
export class PjesEscalaController {
  constructor(private readonly service: PjesEscalaService) {}

  @Post()
  async create(@Body() dto: CreatePjesEscalaDto): Promise<ReturnPjesEscalaDto> {
    const created = await this.service.create(dto);
    return new ReturnPjesEscalaDto(created);
  }

  @Get()
  async findAll(): Promise<ReturnPjesEscalaDto[]> {
    const escalas = await this.service.findAll();
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
  ): Promise<ReturnPjesEscalaDto> {
    const updated = await this.service.update(id, dto);
    return new ReturnPjesEscalaDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
