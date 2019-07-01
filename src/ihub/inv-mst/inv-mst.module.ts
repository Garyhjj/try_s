import { InvMstService } from './inv-mst.service';
import { InvMstController } from './inv-mst.controller';
import { Module } from '@nestjs/common';
import { CommonService } from '../shared/common.service';

@Module({
  controllers: [InvMstController],
  providers: [InvMstService, CommonService],
})
export class InvMstModule {}
