import { CommonService } from './../shared/common.service';
import { Module } from '@nestjs/common';
import { InvListController } from './invlist.controller';
import { InvListService } from './invlist.service';

@Module({
  controllers: [InvListController],
  providers: [InvListService, CommonService],
  exports: [InvListService],
})
export class InvListModule { }
