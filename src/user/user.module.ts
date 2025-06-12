import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MasterEntity } from 'src/master/entities/master.entity';
import { OmeModule } from 'src/ome/ome.module';
import { AuxiliarEntity } from 'src/auxiliar/entities/auxiliar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MasterEntity, AuxiliarEntity]),
    OmeModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
