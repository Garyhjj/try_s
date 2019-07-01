import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { MbuhLabelController } from './mhub-label.controller';
import { MbuhLabelService } from './mhub-label.service';

@Module({
  controllers: [MbuhLabelController],
  providers: [MbuhLabelService, CommonService],
})
export class MhubLabelModule { }