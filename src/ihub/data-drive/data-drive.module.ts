import { Module } from '@nestjs/common';
import { DataDriveController } from './data-drive.controller';
import { DataDriveService } from './data-drive.service';

@Module({
  controllers: [DataDriveController],
  providers: [DataDriveService],
})
export class DataDriveModule {}
