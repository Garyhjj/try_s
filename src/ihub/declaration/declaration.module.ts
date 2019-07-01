import { CoreModule } from './../../core/core.module';
import { DeclarationService } from './declaration.service';
import { DeclarationController } from './declaration.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [DeclarationController],
  providers: [DeclarationService],
})
export class DeclarationModule {}
