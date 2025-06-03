import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PjesOperacaoEntity } from './entities/pjesoperacao.entity';
import { PjesOperacaoService } from './pjesoperacao.service';
import { PjesOperacaoController } from './pjesoperacao.controller';
import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PjesOperacaoEntity, PjesEventoEntity])],
  providers: [PjesOperacaoService],
  controllers: [PjesOperacaoController],
})
export class PjesOperacaoModule {}
