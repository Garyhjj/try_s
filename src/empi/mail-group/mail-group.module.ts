import { MailGroupService } from './mail-group.service';
import { MailGroupController } from './mail-group.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [MailGroupController],
  providers: [MailGroupService],
})
export class MailGroupModule {}