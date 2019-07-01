import { MailGroupService } from './mail-group.service';
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
import { UserID } from '../../shared/decorators';
import { isArray } from 'util';

@UseFilters(HttpExceptionFilter)
// @UseGuards(JwtGuard)
@ApiUseTags('mailgroups')
@Controller('/mailgroups')
@Controller()
export class MailGroupController {
  constructor(private mgSrv: MailGroupService) {}

  @Get()
  async onwayInquire(@Query() query) {
    return await this.mgSrv.getGroups(query);
  }
}
