import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PjesOperacaoService } from './pjesoperacao.service';
import { ReturnPjesOperacaoDto } from './dtos/return-pjesoperacao.dto';
import { CreatePjesOperacaoDto } from './dtos/create-pjesoperacao.dto';
import { User } from 'src/decorators/user.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateStatusPjesOperacaoDto } from './dtos/update-status-pjesoperacao.dto';

@UseGuards(JwtAuthGuard)
@Controller('pjesoperacao')
export class PjesOperacaoController {
  constructor(private readonly pjesOperacaoService: PjesOperacaoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() dto: CreatePjesOperacaoDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesOperacaoDto> {
    return this.pjesOperacaoService.create(dto, user);
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
    @User() user: LoginPayload,
  ): Promise<ReturnPjesOperacaoDto> {
    return this.pjesOperacaoService.update(id, dto, user); // <-- passa para o service
  }

  @Put(':id/status')
  async updateStatusOperacao(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusPjesOperacaoDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesOperacaoDto> {
    return this.pjesOperacaoService.updateStatusOperacao(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: LoginPayload, // <-- adiciona isso
  ): Promise<void> {
    return this.pjesOperacaoService.remove(id, user); // <-- passa para o service
  }
}
