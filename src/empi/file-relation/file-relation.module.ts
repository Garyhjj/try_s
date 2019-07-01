import { FileRelationService } from './file-relation.service';
import { FileRelationController } from './file-relation.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [FileRelationController],
  providers: [FileRelationService],
})
export class FileRelationModule {}
