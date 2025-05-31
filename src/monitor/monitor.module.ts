import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { UserModule } from 'src/user/user.module';
import { MonitorService } from './monitor.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorEntity]), UserModule],
  providers: [MonitorService],
  controllers: [MonitorController],
})
export class MonitorModule {}
