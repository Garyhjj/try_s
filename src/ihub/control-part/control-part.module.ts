import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { ControlPartService } from './control-part.service';
import { ControlPartController } from './control-part.controller';

@Module({
  controllers: [ControlPartController],
  providers: [ControlPartService, CommonService],
})
export class ControlPartModule { }