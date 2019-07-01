import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { RenderService } from './services/render.service';

@Module({
  imports: [],
  exports: [EmailService, RenderService],
  providers: [EmailService, RenderService],
})
export class SharedModule {}
