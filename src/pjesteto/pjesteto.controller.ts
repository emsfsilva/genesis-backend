import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePjesTetoDto } from './dtos/create-pjesteto.dto';
import { ReturnPjesTetoDto } from './dtos/return-pjesteto.dto';
import { PjesTetoService } from './pjesteto.service';

@Controller('pjesteto')
export class PjesTetoController {
  constructor(private readonly pjestetoService: PjesTetoService) {}

  @Post()
  async create(@Body() dto: CreatePjesTetoDto): Promise<ReturnPjesTetoDto> {
    return this.pjestetoService.create(dto);
  }

  @Get()
  async findAll(): Promise<ReturnPjesTetoDto[]> {
    return this.pjestetoService.findAll();
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
