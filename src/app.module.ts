import { CoreModule } from './core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { IhubModule } from './ihub/ihub.module';
import { ElModule } from './el/el.module';
import { HttpModule } from '@nestjs/common/http';
import { PrivilegeModule } from './privilege/privilege.module';

@Module({
  imports: [HttpModule, CoreModule, UploadModule, IhubModule, ElModule, PrivilegeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
