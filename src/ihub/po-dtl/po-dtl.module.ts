import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { PoDtlController } from './po-dtl.controller';
import { PoDtlService } from './po-dtl.service';

@Module({
  controllers: [PoDtlController],
  providers: [PoDtlService, CommonService],
})
export class PoDtlModule { }