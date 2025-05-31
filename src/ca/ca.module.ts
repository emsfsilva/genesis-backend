import { Module } from '@nestjs/common';
import { CaController } from './ca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaEntity } from './entities/ca.entity';
import { UserModule } from 'src/user/user.module';
import { CaService } from './ca.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaEntity]), UserModule],
  providers: [CaService],
  controllers: [CaController],
})
export class CaModule {}
