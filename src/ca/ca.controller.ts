import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CaEntity } from './entities/ca.entity';
import { ReturnCaDTO } from './dtos/return-ca.dto';
import { CaService } from './ca.service';
import { CreateCaDTO } from './dtos/create-ca.dto';
import { UpdateCaDTO } from './dtos/update-ca.dto';

@Roles(
  UserType.Master,
  UserType.Comando,
  UserType.CmtCa,
  UserType.CmtCia,
  UserType.Adm,
  UserType.Monitor,
  UserType.Aluno,
)
@UsePipes(ValidationPipe)
@Controller('ca')
export class CaController {
  constructor(private readonly caService: CaService) {}

  @Get()
  async findAll(): Promise<ReturnCaDTO[]> {
    return (await this.caService.findAll()).map((ca) => new ReturnCaDTO(ca));
  }

  @Post()
  async createCa(@Body() createCa: CreateCaDTO): Promise<CaEntity> {
    return this.caService.createCa(createCa);
  }

  @Delete('/:caId')
  async deleteCa(@Param('caId') caId: number): Promise<DeleteResult> {
    return this.caService.deleteCa(caId);
  }

  @Put('/:caId')
  async updateCa(
    @Body() updateCa: UpdateCaDTO,
    @Param('caId') caId: number,
  ): Promise<CaEntity> {
    return this.caService.updateCa(updateCa, caId);
  }
}
