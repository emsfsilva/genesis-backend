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
import { MonitorEntity } from './entities/monitor.entity';
import { ReturnMonitorDTO } from './dtos/return-monitor.dto';
import { MonitorService } from './monitor.service';
import { CreateMonitorDTO } from './dtos/create-monitor.dto';
import { UpdateMonitorDTO } from './dtos/update-monitor.dto';

@Controller('monitor')
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
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get()
  async findAll(): Promise<ReturnMonitorDTO[]> {
    return (await this.monitorService.findAll()).map(
      (monitor) => new ReturnMonitorDTO(monitor),
    );
  }

  @Post()
  async createMonitor(
    @Body() createMonitor: CreateMonitorDTO,
  ): Promise<MonitorEntity> {
    return this.monitorService.createMonitor(createMonitor);
  }

  @Delete('/:monitorId')
  async deleteMonitor(
    @Param('monitorId') monitorId: number,
  ): Promise<DeleteResult> {
    return this.monitorService.deleteMonitor(monitorId);
  }

  @Put('/:monitorId')
  async updateMonitor(
    @Body() updateMonitor: UpdateMonitorDTO,
    @Param('monitorId') monitorId: number,
  ): Promise<MonitorEntity> {
    return this.monitorService.updateMonitor(updateMonitor, monitorId);
  }
}
