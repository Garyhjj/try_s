import { CommonService } from '../shared/common.service';
import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';

@Module({
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule { }