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
  Query,
} from '@nestjs/common';
import { PjesDistService } from './pjesdist.service';
import { CreatePjesDistDto } from './dtos/create-pjesdist.dto';
import { ReturnPjesDistDto } from './dtos/return-pjesdist.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserType } from 'src/user/enum/user-type.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pjesdist')
@Roles(UserType.Master, UserType.Auxiliar, UserType.Diretor)
export class PjesDistController {
  constructor(private readonly pjesDistService: PjesDistService) {}

  @Post()
  async create(
    @Body() data: CreatePjesDistDto,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesDistDto> {
    return this.pjesDistService.create(data, user);
  }

  @Get()
  async findAll(
    @User() user: LoginPayload,
    @Query('mes') mes?: number,
    @Query('ano') ano?: number,
  ): Promise<ReturnPjesDistDto[]> {
    return this.pjesDistService.findAll(user, mes, ano);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesDistDto> {
    return this.pjesDistService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePjesDistDto>,
    @User() user: LoginPayload,
  ): Promise<ReturnPjesDistDto> {
    return this.pjesDistService.update(id, data, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: LoginPayload,
  ): Promise<void> {
    return this.pjesDistService.remove(id, user);
  }
}
