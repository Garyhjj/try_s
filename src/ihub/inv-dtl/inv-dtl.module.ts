import { InvDtlService } from './inv-dtl.service';

import { Module } from '@nestjs/common';
import { CommonService } from '../shared/common.service';
import { InvDtlController } from './inv-dtl.controller';

@Module({
  controllers: [InvDtlController],
  providers: [InvDtlService, CommonService],
})
export class InvDtlModule {}
