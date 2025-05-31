import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AdmEntity } from 'src/adm/entities/adm.entity';
import { CaEntity } from 'src/ca/entities/ca.entity';
import { CiaEntity } from 'src/cia/entities/cia.entity';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { AlunoModule } from 'src/aluno/aluno.module';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { CmtciaEntity } from 'src/cmtcia/entities/cmtcia.entity';
import { SubcomEntity } from 'src/subcom/entities/subcom.entity';
import { MasterEntity } from 'src/master/entities/master.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AlunoEntity,
      MonitorEntity,
      AdmEntity,
      CmtciaEntity,
      CaEntity,
      SubcomEntity,
      MasterEntity,
      CiaEntity,
      ComunicacaoEntity,
    ]),
    forwardRef(() => AlunoModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
