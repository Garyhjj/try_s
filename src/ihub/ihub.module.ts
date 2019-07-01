import { OnwayModule } from './onway/onway.module';
import { SoMstModule } from './so-mst/so-mst.module';
import { PoDtlModule } from './po-dtl/po-dtl.module';
import { DeclarationModule } from './declaration/declaration.module';
import { ShortageModule } from './shortage/shortage.module';
import { DeliveryNoticeModule } from './delivery-notice/delivery-notice.module';
import { InvDtlModule } from './inv-dtl/inv-dtl.module';
import { InvMstModule } from './inv-mst/inv-mst.module';
import { Module } from '@nestjs/common';
import { AsnMstModule } from './asn-mst/asn-mst.module';
import { DataDriveModule } from './data-drive/data-drive.module';
import { AsnPalletModule } from './asn-pallet/asn-pallet.module';
import { AsnDtlModule } from './asn-dtl/asn-dtl.module';
import { LookupModule } from './lookup/lookup.module';
import { BlMstModule } from './bl-mst/bl-mst.module';
import { CombineSoMstModule } from './combine-so-mst/combine-so-mst.module';
import { BlDtlModule } from './bl-dtl/bl-dtl.module';
import { ShippingInstructionModule } from './shipping-instruction/shipping-instruction.module';
import { UrgentShipmentModule } from './urgent-shipment/urgent-shipment.module';
import { MhubLabelModule } from './mhub-label/mhub-label.module';
import { PacklistModule } from './packlist/packlist.module';
import { CommonModule } from './shared/common.module';
import { UnboundPartModule } from './unbound-part/unbound-part.module';
import { ControlPartModule } from './control-part/control-part.module';
import { InvListModule } from './inv-list/invlist.module';
import { ReportModule } from './report/report.module';
import { UtilsModule } from './utils/utils.module';
import { DebugModule } from './debug/debug.module';

@Module({
  imports: [
    AsnMstModule,
    DataDriveModule,
    AsnPalletModule,
    AsnDtlModule,
    LookupModule,
    DeliveryNoticeModule,
    InvMstModule,
    InvDtlModule,
    BlMstModule,
    BlDtlModule,
    CombineSoMstModule,
    ShippingInstructionModule,
    UrgentShipmentModule,
    ShortageModule,
    MhubLabelModule,
    DeclarationModule,
    PacklistModule,
    PoDtlModule,
    InvListModule,
    ReportModule,
    CommonModule,
    UnboundPartModule,
    ControlPartModule,
    SoMstModule,
    OnwayModule,
    UtilsModule,
    DebugModule,
  ],
})
export class IhubModule {}
