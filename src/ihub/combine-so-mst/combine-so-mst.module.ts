import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { CombineSoMstController } from './combine-so-mst.controller';
import { CombineSoMstService } from './combine-so-mst.service';

@Module({
  controllers: [CombineSoMstController],
  providers: [CombineSoMstService, CommonService],
})
export class CombineSoMstModule { }
