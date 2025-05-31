import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressModule } from './address/address.module';
import { CacheCustomModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { CaModule } from './ca/ca.module';
import { CiaModule } from './cia/cia.module';
import { AdmModule } from './adm/adm.module';
import { TurmaModule } from './turma/turma.module';
import { AlunoModule } from './aluno/aluno.module';
import { ComunicacaoModule } from './comunicacao/comunicacao.module';
import { MonitorModule } from './monitor/monitor.module';
import { SubcomModule } from './subcom/subcom.module';
import { CmtciaModule } from './cmtcia/cmtcia.module';
import { MasterModule } from './master/master.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/migration/{.ts,*.js}`],
      migrationsRun: true,
    }),
    UserModule,
    StateModule,
    CityModule,
    AddressModule,
    CacheCustomModule,
    AuthModule,
    JwtModule,
    CaModule,
    CiaModule,
    AdmModule,
    TurmaModule,
    AlunoModule,
    MonitorModule,
    SubcomModule,
    CmtciaModule,
    MasterModule,
    ComunicacaoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
