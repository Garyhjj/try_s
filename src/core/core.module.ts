import { DatabaseService } from './database.service';
import { Module, Global } from '@nestjs/common';
import { UtilService } from './util.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [UtilService, DatabaseService, CacheService],
  exports: [UtilService, DatabaseService, CacheService],
})
export class CoreModule {}
