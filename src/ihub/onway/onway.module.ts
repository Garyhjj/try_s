import { OnwayController } from './onway.controller';
import { OnwayService } from './onway.service';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [SharedModule, UtilsModule],
  controllers: [OnwayController],
  providers: [OnwayService],
})
export class OnwayModule {}
