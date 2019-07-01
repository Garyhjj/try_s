import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { BlMstController } from './bl-mst.controller';
import { BlMstService } from './bl-mst.service';

@Module({
  controllers: [BlMstController],
  providers: [BlMstService, CommonService],
})
export class BlMstModule { }
