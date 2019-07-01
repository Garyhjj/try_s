import { LookupModule } from './lookup/lookup.module';
import { MailGroupModule } from './mail-group/mail-group.module';
import { FileRelationModule } from './file-relation/file-relation.module';
import { FilesModule } from './files/files.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    FilesModule,
    FileRelationModule,
    MailGroupModule,
    LookupModule,
  ],
})
export class EmpiModule {}
