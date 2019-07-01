import { EmpiModule } from './empi/empi.module';
import { CoreModule } from './core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/common/http';

@Module({
  imports: [HttpModule, CoreModule, EmpiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
