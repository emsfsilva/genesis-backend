import { Module } from '@nestjs/common';
import { AdmController } from './adm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmEntity } from './entities/adm.entity';
import { UserModule } from 'src/user/user.module';
import { AdmService } from './adm.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdmEntity]), UserModule],
  providers: [AdmService],
  controllers: [AdmController],
})
export class AdmModule {}
