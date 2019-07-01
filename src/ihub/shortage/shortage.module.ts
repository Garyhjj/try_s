import { Module } from '@nestjs/common';
import { ShortageController } from './shortage.controller';
import { ShortageService } from './shortage.service';

@Module({
  imports: [],
  controllers: [ShortageController],
  providers: [ShortageService],
})
export class ShortageModule {}
