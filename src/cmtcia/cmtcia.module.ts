import { Module } from '@nestjs/common';
import { CmtciaController } from './cmtcia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmtciaEntity } from './entities/cmtcia.entity';
import { UserModule } from 'src/user/user.module';
import { CmtciaService } from './cmtcia.service';

@Module({
  imports: [TypeOrmModule.forFeature([CmtciaEntity]), UserModule],
  providers: [CmtciaService],
  controllers: [CmtciaController],
})
export class CmtciaModule {}
