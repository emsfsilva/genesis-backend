import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PjesEventoService } from './pjesevento.service';
import { PjesEventoController } from './pjesevento.controller';
import { PjesEventoEntity } from './entities/pjesevento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PjesEventoEntity])],
  providers: [PjesEventoService],
  controllers: [PjesEventoController],
  exports: [TypeOrmModule, PjesEventoService],
})
export class PjesEventoModule {}
