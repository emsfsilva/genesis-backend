/*
import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoEntity } from './entities/aluno.entity';
import { TurmaModule } from '../turma/turma.module';
import { UserModule } from 'src/user/user.module';
import { ComunicacaoModule } from 'src/comunicacao/comunicacao.module';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlunoEntity, ComunicacaoEntity]),
    UserModule,
    TurmaModule,
    ComunicacaoModule,
  ],
  providers: [AlunoService],
  exports: [AlunoService],
  controllers: [AlunoController],
})
export class AlunoModule {}

*/

// aluno.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoEntity } from './entities/aluno.entity';
import { TurmaModule } from '../turma/turma.module';
import { UserModule } from 'src/user/user.module';
import { ComunicacaoModule } from 'src/comunicacao/comunicacao.module';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlunoEntity, ComunicacaoEntity, UserEntity]),
    forwardRef(() => UserModule),
    TurmaModule,
    forwardRef(() => ComunicacaoModule),
  ],
  providers: [AlunoService],
  exports: [AlunoService],
  controllers: [AlunoController],
})
export class AlunoModule {}
