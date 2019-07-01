import { UtilsService } from './utils.service';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { UtilsController } from './utils.controller';

@Module({
  imports: [SharedModule],
  controllers: [UtilsController],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
