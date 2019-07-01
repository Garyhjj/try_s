import { FileRelationService } from './file-relation.service';
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
  Delete,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserID } from '../../shared/decorators';
import { isArray } from 'util';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('relation')
@Controller('/relation')
@Controller()
export class FileRelationController {
  constructor(private frSrv: FileRelationService) {}

  @Get()
  async getRelation(@Query() query) {
    return await this.frSrv.getRelation(query);
  }

  @Post()
  async updateRelation(@Body() body, @UserID() userID) {
    if (!Array.isArray(body)) {
      body = [body];
    }
    const ids: any = await Promise.all(
      body.map(b => this.frSrv.updateRelation(b, userID)),
    );
  }

  @Delete()
  async deleteRelation(@Query() { id }) {
    return this.frSrv.deleteRelation(id);
  }
}
