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
import { PjesDistService } from './pjesdist.service';
import { CreatePjesDistDto } from './dtos/create-pjesdist.dto';
import { ReturnPjesDistDto } from './dtos/return-pjesdist.dto';

@Controller('pjesdist')
export class PjesDistController {
  constructor(private readonly pjesDistService: PjesDistService) {}

  @Post()
  async create(@Body() data: CreatePjesDistDto): Promise<ReturnPjesDistDto> {
    return this.pjesDistService.create(data);
  }

  @Get()
  async findAll(): Promise<ReturnPjesDistDto[]> {
    return this.pjesDistService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnPjesDistDto> {
    return this.pjesDistService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePjesDistDto>,
  ): Promise<ReturnPjesDistDto> {
    return this.pjesDistService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pjesDistService.remove(id);
  }
}
