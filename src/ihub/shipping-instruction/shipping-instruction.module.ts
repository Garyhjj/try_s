import { AsnMstModule } from './../asn-mst/asn-mst.module';
import { AsnDtlModule } from './../asn-dtl/asn-dtl.module';
import { Module } from '@nestjs/common';
import { ShippingInstructionController } from './shipping-instruction.controller';
import { ShippingInstructionService } from './shipping-instruction.service';

@Module({
  imports: [AsnDtlModule, AsnMstModule],
  controllers: [ShippingInstructionController],
  providers: [ShippingInstructionService],
})
export class ShippingInstructionModule {}
