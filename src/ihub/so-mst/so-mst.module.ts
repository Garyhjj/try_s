import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { SoMstController } from './so-mst.controller';
import { SoMstService } from './so-mst.service';

@Module({
  controllers: [SoMstController],
  providers: [SoMstService, CommonService],
})
export class SoMstModule { }