import { Module } from '@nestjs/common';
import { UrgentShipmentController } from './urgent-shipment.controller';
import { UrgentShipmentService } from './urgent-shipment.service';

@Module({
  imports: [],
  controllers: [UrgentShipmentController],
  providers: [UrgentShipmentService],
})
export class UrgentShipmentModule {}
