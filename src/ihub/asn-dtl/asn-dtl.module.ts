import { Module } from '@nestjs/common';
import { AsnDtlController } from './asn-dtl.controller';
import { AsnDtlService } from './asn-dtl.service';

@Module({
  controllers: [AsnDtlController],
  providers: [AsnDtlService],
  exports: [AsnDtlService],
})
export class AsnDtlModule {}
