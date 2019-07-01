import { JwtGuard } from './../../guard/jwt.guard';
import { HttpExceptionFilter } from './../../shared/filters/http-exception.filter';
import { ShortageService } from './shortage.service';

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserID } from '../../shared/decorators';

@UseGuards(JwtGuard)
@UseFilters(HttpExceptionFilter)
@ApiUseTags('shortage')
@Controller('/shortage')
@Controller()
export class ShortageController {
  constructor(private shortageService: ShortageService) {}

  @ApiOperation({ title: '获得asn_mst资料' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @Get('asn_mst')
  async getAsn(@Query() query) {
    let result;
    result = await this.shortageService.getAsn(query);
    return result;
  }

  @ApiOperation({ title: '获得料號资料' })
  @ApiResponse({
    status: 200,
  })
  @Get('parts')
  async getParts(@Query() query) {
    let result;
    result = await this.shortageService.getParts(query.lot_no);
    return result;
  }

  @ApiOperation({ title: '插入缺料信息' })
  @ApiResponse({
    status: 200,
  })
  @Post()
  async insertShortage(@Body() body) {
    let result;

    result = await this.shortageService.insertShortage(body);
    return result;
  }

  @ApiOperation({ title: '更新缺料信息' })
  @ApiResponse({
    status: 200,
  })
  @Put()
  async updateShortage(@Body() body) {
    let result;

    result = await this.shortageService.updateShortage({
      columns: { ...body },
      where: {
        ID: body.ID,
      },
    });
    return result;
  }

  @ApiOperation({ title: '獲得缺料信息' })
  @ApiResponse({
    status: 200,
  })
  @Get()
  async getShortage(@Query() query) {
    let result;
    result = await this.shortageService.getShortage(query);
    return result;
  }

  @ApiOperation({ title: '獲得更詳細的缺料信息' })
  @ApiResponse({
    status: 200,
  })
  @Get('/details')
  async getShortageDetail(@Query() query) {
    let result;
    result = await this.shortageService.getShortageDetail(query);
    return result;
  }

  @ApiOperation({ title: '刪除缺料信息' })
  @ApiResponse({
    status: 200,
  })
  @Delete()
  async delShortage(@Query() query) {
    let result;
    result = await this.shortageService.deleteShortage(query.id);
    return result;
  }

  @ApiOperation({ title: '更新庫存計劃，for超交' })
  @ApiResponse({
    status: 200,
  })
  @Post('/hold')
  async updateHoldCompare(@Body() body, @UserID() userID) {
    if (Array.isArray(body)) {
      return Promise.all(
        body.map(b => this.shortageService.updateHoldCompare(b, userID)),
      );
    } else {
      return this.shortageService.updateHoldCompare(body, userID);
    }
  }

  @ApiOperation({ title: '獲得庫存計劃，for超交' })
  @ApiResponse({
    status: 200,
  })
  @Get('/hold')
  async getHoldCompare() {
    return this.shortageService.getHoldCompare();
  }
}
