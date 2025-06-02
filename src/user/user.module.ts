import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MasterEntity } from 'src/master/entities/master.entity';
import { OmeModule } from 'src/ome/ome.module'; // ✅ importar o módulo

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MasterEntity]), OmeModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
