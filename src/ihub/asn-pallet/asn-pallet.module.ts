import { Module } from '@nestjs/common';
import { AsnPalletController } from './asn-pallet.controller';
import { AsnPalletService } from './asn-pallet.service';

@Module({
  controllers: [AsnPalletController],
  providers: [AsnPalletService],
})
export class AsnPalletModule {}
