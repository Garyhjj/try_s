import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
