import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PjesEscalaService } from './pjesescala.service';
import { PjesEscalaController } from './pjesescala.controller';
import { PjesEscalaEntity } from './entities/pjesescala.entity';
import { PjesEventoModule } from 'src/pjesevento/pjesevento.module';
import { PjesOperacaoModule } from 'src/pjesoperacao/pjesoperacao.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PjesEscalaEntity]),
    PjesEventoModule,
    PjesOperacaoModule,
    UserModule, // se você injeta repositório de usuário também
  ],
  controllers: [PjesEscalaController],
  providers: [PjesEscalaService],
})
export class PjesescalaModule {}
