import { CommonService } from './../shared/common.service';
import { Module } from '@nestjs/common';
import { DebugController } from './debug.controller';
import { DebugService } from './debug.service';

@Module({
  controllers: [DebugController],
  providers: [DebugService, CommonService],
  exports: [DebugService],
})
export class DebugModule {}
