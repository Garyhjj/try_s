import { DeliveryNoticeController } from './delivery-notice.controller';
import { DeliveryNoticeService } from './delivery-notice.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DeliveryNoticeController],
  providers: [DeliveryNoticeService],
})
export class DeliveryNoticeModule {}
