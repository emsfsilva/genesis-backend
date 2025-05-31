import { Module } from '@nestjs/common';
import { SubcomController } from './subcom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcomEntity } from './entities/subcom.entity';
import { UserModule } from 'src/user/user.module';
import { SubcomService } from './subcom.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubcomEntity]), UserModule],
  providers: [SubcomService],
  controllers: [SubcomController],
})
export class SubcomModule {}
