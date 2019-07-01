import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { UnboundPartController } from './unbound-part.controller';
import { UnboundPartService } from './unbound-part.service';

@Module({
  controllers: [UnboundPartController],
  providers: [UnboundPartService, CommonService],
})
export class UnboundPartModule { }