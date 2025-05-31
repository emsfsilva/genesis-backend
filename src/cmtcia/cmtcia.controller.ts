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
import { CmtciaEntity } from './entities/cmtcia.entity';
import { ReturnCmtciaDTO } from './dtos/return-cmtcia.dto';
import { CmtciaService } from './cmtcia.service';
import { CreateCmtciaDTO } from './dtos/create-cmtcia.dto';
import { UpdateCmtciaDTO } from './dtos/update-cmtcia.dto';

@Controller('cmtcia')
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
export class CmtciaController {
  constructor(private readonly cmtciaService: CmtciaService) {}

  @Get()
  async findAll(): Promise<ReturnCmtciaDTO[]> {
    return (await this.cmtciaService.findAll()).map(
      (cmtcia) => new ReturnCmtciaDTO(cmtcia),
    );
  }

  @Post()
  async createCmtcia(
    @Body() createCmtcia: CreateCmtciaDTO,
  ): Promise<CmtciaEntity> {
    return this.cmtciaService.createCmtcia(createCmtcia);
  }

  @Delete('/:cmtciaId')
  async deleteCmtcia(
    @Param('cmtciaId') cmtciaId: number,
  ): Promise<DeleteResult> {
    return this.cmtciaService.deleteCmtcia(cmtciaId);
  }

  @Put('/:cmtciaId')
  async updateCmtcia(
    @Body() updateCmtcia: UpdateCmtciaDTO,
    @Param('cmtciaId') cmtciaId: number,
  ): Promise<CmtciaEntity> {
    return this.cmtciaService.updateCmtcia(updateCmtcia, cmtciaId);
  }
}
