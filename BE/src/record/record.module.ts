import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { RedisModule } from '../config/redis/redis.module';
import { QueryDBModule } from '../config/query-database/query-db.moudle';
import { UsageModule } from '../usage/usage.module';
import { TableModule } from 'src/table/table.module';

@Module({
  imports: [RedisModule, QueryDBModule, UsageModule, TableModule],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
