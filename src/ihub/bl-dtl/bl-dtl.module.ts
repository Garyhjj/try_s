import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { BlDtlController } from './bl-dtl.controller';
import { BlDtlService } from './bl-dtl.service';

@Module({
  controllers: [BlDtlController],
  providers: [BlDtlService, CommonService],
})
export class BlDtlModule { }
