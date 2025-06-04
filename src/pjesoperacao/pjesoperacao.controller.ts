import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PjesOperacaoService } from './pjesoperacao.service';
import { ReturnPjesOperacaoDto } from './dtos/return-pjesoperacao.dto';
import { CreatePjesOperacaoDto } from './dtos/create-pjesoperacao.dto';

@Controller('pjesoperacao')
export class PjesOperacaoController {
  constructor(private readonly pjesOperacaoService: PjesOperacaoService) {}

  @Post()
  async create(
    @Body() dto: CreatePjesOperacaoDto,
  ): Promise<ReturnPjesOperacaoDto> {
    return this.pjesOperacaoService.create(dto);
  }

  @Get()
  async findAll(): Promise<ReturnPjesOperacaoDto[]> {
    return this.pjesOperacaoService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnPjesOperacaoDto> {
    return this.pjesOperacaoService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePjesOperacaoDto,
  ): Promise<ReturnPjesOperacaoDto> {
    return this.pjesOperacaoService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pjesOperacaoService.remove(id);
  }
}
