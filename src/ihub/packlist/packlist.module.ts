import { CommonService } from './../shared/common.service';
import { Module } from '@nestjs/common';
import { PacklistController } from './packlist.controller';
import { PackListService } from './packlist.service';

@Module({
  controllers: [PacklistController],
  providers: [PackListService, CommonService],
  exports: [PackListService],
})
export class PacklistModule { }
