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
import { AdmEntity } from './entities/adm.entity';
import { ReturnAdmDTO } from './dtos/return-adm.dto';
import { AdmService } from './adm.service';
import { CreateAdmDTO } from './dtos/create-adm.dto';
import { UpdateAdmDTO } from './dtos/update-adm.dto';

@Controller('adm')
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
export class AdmController {
  constructor(private readonly admService: AdmService) {}

  @Get()
  async findAll(): Promise<ReturnAdmDTO[]> {
    return (await this.admService.findAll()).map(
      (adm) => new ReturnAdmDTO(adm),
    );
  }

  @Post()
  async createAdm(@Body() createAdm: CreateAdmDTO): Promise<AdmEntity> {
    return this.admService.createAdm(createAdm);
  }

  @Delete('/:admId')
  async deleteAdm(@Param('admId') admId: number): Promise<DeleteResult> {
    return this.admService.deleteAdm(admId);
  }

  @Put('/:admId')
  async updateAdm(
    @Body() updateAdm: UpdateAdmDTO,
    @Param('admId') admId: number,
  ): Promise<AdmEntity> {
    return this.admService.updateAdm(updateAdm, admId);
  }
}
