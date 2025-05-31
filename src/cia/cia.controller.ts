import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CiaService } from './cia.service';
import { CreateCia } from './dtos/create-cia.dto';
import { ReturnCia } from './dtos/return-cia.dto';
import { CiaEntity } from './entities/cia.entity';

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
@Controller('cia')
export class CiaController {
  constructor(private readonly ciaService: CiaService) {}

  @Get()
  async findAllCias(): Promise<ReturnCia[]> {
    return (await this.ciaService.findAllCias()).map(
      (cia) => new ReturnCia(cia),
    );
  }

  @Post()
  async createCia(@Body() createCia: CreateCia): Promise<CiaEntity> {
    return this.ciaService.createCia(createCia);
  }
}
