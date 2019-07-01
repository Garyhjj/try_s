import { UserID } from './../../shared/decorators/index';
import { FilesService } from './files.service';
import { JwtGuard } from './../../guard/jwt.guard';
import { HttpExceptionFilter } from './../../shared/filters/http-exception.filter';

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { isArray } from 'util';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('files')
@Controller('/files')
@Controller()
export class FilesController {
  constructor(private filesSrv: FilesService) {}

  @Get()
  async getFiles(@Query() query) {
    return await this.filesSrv.getFiles(query);
  }

  @Post()
  async updateFiles(@Body() body, @UserID() userID, @Query() query) {
    if (!Array.isArray(body)) {
      body = [body];
    }
    const ids: any = await Promise.all(
      body.map(b => this.filesSrv.updateFiles(b, userID)),
    );
    // const first = body[0];
    // if (!first.ID && first.mails) {
    //   this.filesSrv
    //     .getFilesByIDs(ids)
    //     .then(ls => this.filesSrv.sendInformMail(first.mails, ls));
    // }
    this.filesSrv.sendMailtoBoss();
    if (query && query.feedback) {
      return this.filesSrv.getFilesByIDs(ids);
    }
  }

  @Post('mails')
  async sendMail(@Body() body) {
    return this.filesSrv.sendMail(body.ids, body.mails);
  }

  @Get('mails/reject')
  async sendRejectMail(@Query() query, @UserID() rejecterID) {
    return this.filesSrv.sendRejectMail(query.fileID, rejecterID);
  }

  @Get('set/boss')
  async getBoss(@Query() query) {
    const {id, company} = query;
    return this.filesSrv.getBoss(id, company);
  }
}
