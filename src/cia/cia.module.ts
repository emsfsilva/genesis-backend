import { Module } from '@nestjs/common';
import { CiaController } from './cia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiaEntity } from './entities/cia.entity';
import { CiaService } from './cia.service';

@Module({
  imports: [TypeOrmModule.forFeature([CiaEntity])],
  providers: [CiaService],
  controllers: [CiaController],
  exports: [CiaService],
})
export class CiaModule {}
