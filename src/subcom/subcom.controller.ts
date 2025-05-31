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
import { SubcomEntity } from './entities/subcom.entity';
import { ReturnSubcomDTO } from './dtos/return-subcom.dto';
import { SubcomService } from './subcom.service';
import { CreateSubcomDTO } from './dtos/create-subcom.dto';
import { UpdateSubcomDTO } from './dtos/update-subcom.dto';

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
@Controller('subcom')
export class SubcomController {
  constructor(private readonly subcomService: SubcomService) {}

  @Get()
  async findAll(): Promise<ReturnSubcomDTO[]> {
    return (await this.subcomService.findAll()).map(
      (subcom) => new ReturnSubcomDTO(subcom),
    );
  }

  @Post()
  async createSubcom(
    @Body() createSubcom: CreateSubcomDTO,
  ): Promise<SubcomEntity> {
    return this.subcomService.createSubcom(createSubcom);
  }

  @Delete('/:subcomId')
  async deleteSubcom(
    @Param('subcomId') subcomId: number,
  ): Promise<DeleteResult> {
    return this.subcomService.deleteSubcom(subcomId);
  }

  @Put('/:subcomId')
  async updateSubcom(
    @Body() updateSubcom: UpdateSubcomDTO,
    @Param('subcomId') subcomId: number,
  ): Promise<SubcomEntity> {
    return this.subcomService.updateSubcom(updateSubcom, subcomId);
  }
}
