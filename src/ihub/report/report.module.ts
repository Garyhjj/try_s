import { CommonService } from './../shared/common.service';
import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, CommonService],
  exports: [ReportService],
})
export class ReportModule { }
