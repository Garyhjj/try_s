import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import { DebugInterface } from './debug.dto';
import { DebugService } from './debug.service';
import * as moment from 'moment';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

// @UseGuards(JwtGuard)
@ApiUseTags('debug2')
@Controller('/debug2')
export class DebugController {
  constructor(private debugService: DebugService) {}

  // 验证后端服务是否正常
  @Get('/task1')
  async returnString(@Query() query) {
    return 'task1 success';
  }

  // 验证db class是否能查询
  @Get('/task2')
  async queryFromDbWithoutToken(@Query() query) {
    // tslint:disable-next-line:no-console
    console.log('debug task2 in');
    const res = await this.debugService.getAsnByLotNo(query.lotNo || 'P277221');
    // tslint:disable-next-line:no-console
    console.log('debug task2 out');
    return res.rows;
  }

  // 验证 db table class 是否能查询
  @Get('/task3')
  async queryFromDbWithoutToken2(@Query() query) {
    // tslint:disable-next-line:no-console
    console.log('debug task3 in');
    const res = await this.debugService.getAsnByLotNo2(
      query.lotNo || 'P277221',
    );
    // tslint:disable-next-line:no-console
    console.log('debug task3 out');
    return res;
  }

  // 验证db class + token 是否能查询
  @UseGuards(JwtGuard)
  @Get('/task4')
  async queryFromDbWithToken(@Query() query) {
    const res = await this.debugService.getAsnByLotNo(query.lotNo || 'P277221');
    return res.rows;
  }

  // 验证db table class + token 是否能查询
  @UseGuards(JwtGuard)
  @Get('/task5')
  async queryFromDbWithToken2(@Query() query) {
    const res = await this.debugService.getAsnByLotNo2(
      query.lotNo || 'P277221',
    );
    return res;
  }
}
