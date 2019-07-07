import { LookupService } from './lookup.service';
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
@ApiUseTags('lookup')
@Controller('/lookup')
@Controller()
export class LookupController {
  constructor(private lookupSrv: LookupService) { }

  @Get()
  async onwayInquire(@Query() query) {
    return await this.lookupSrv.getLookup(query);
  }

  @Get('operations')
  getOperations() {
    return this.lookupSrv.getOperations();
  }

  @Get('lines')
  getLines() {
    return this.lookupSrv.getLines();
  }
  @Get('parts')
  getParts() {
    return this.lookupSrv.getParts();
  }
  @Get('models')
  getModels() {
    return this.lookupSrv.getModels();
  }

  @Get('families')
  getFamilyNames() {
    return this.lookupSrv.getFamilyNames();
  }

  @Post('boss')
  updateBoss(@Body() body, @UserID() userID) {
    return this.lookupSrv.updateBoss(body, userID);
  }

  @Delete()

  delete(@Query() query) {
    const { id } = query;
    if (+id > 0) {
      return this.lookupSrv.deleteLookup(+id);
    } else {
      return null;
    }
  }

  @Get('GetUserLikeNoSite')
  getEmp(@Query() query) {
    const { emp_name } = query;
    return this.lookupSrv.getEmp(emp_name);
  }

  @Post('login')
  async login(@Body() body) {
    const { userName } = body;
    const res = await this.lookupSrv.getEmpByUsername(userName);
    return res && res.length > 0 ? res[0] : null;
  }
}
