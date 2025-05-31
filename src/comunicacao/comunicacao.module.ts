import { forwardRef, Module } from '@nestjs/common';
import { ComunicacaoController } from './comunicacao.controller';
import { ComunicacaoService } from './comunicacao.service';
import { ComunicacaoEntity } from './entities/comunicacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AlunoModule } from 'src/aluno/aluno.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComunicacaoEntity,
      UserEntity,
      AlunoEntity,
      JwtAuthGuard,
      JwtService,
    ]),
    forwardRef(() => AlunoModule),
  ],
  providers: [ComunicacaoService, JwtService],
  controllers: [ComunicacaoController],
  exports: [ComunicacaoService],
})
export class ComunicacaoModule {}
