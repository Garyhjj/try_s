import { CommonService } from './../shared/common.service';
import { Module } from '@nestjs/common';
import { AsnMstController } from './asn-mst.controller';
import { AsnMstService } from './asn-mst.service';

@Module({
  controllers: [AsnMstController],
  providers: [AsnMstService, CommonService],
  exports: [AsnMstService],
})
export class AsnMstModule {}
