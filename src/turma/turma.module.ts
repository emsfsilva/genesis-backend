import { Module } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurmaEntity } from './entities/turma.entity';
import { CiaEntity } from 'src/cia/entities/cia.entity';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TurmaEntity, CiaEntity, AlunoEntity])],
  providers: [TurmaService],
  controllers: [TurmaController],
  exports: [TurmaService],
})
export class TurmaModule {}
