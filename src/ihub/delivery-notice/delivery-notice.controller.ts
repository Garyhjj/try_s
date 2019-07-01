import { UserID } from '../../shared/decorators';
import { HttpExceptionFilter } from './../../shared/filters/http-exception.filter';
import { DeliveryNoticeService } from './delivery-notice.service';

import { JwtGuard } from './../../guard/jwt.guard';
import * as moment from 'moment';

import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DeliveryNotice } from './delivery-notive.dto';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('deliveryNotice')
@Controller('/deliveryNotice')
@Controller()
export class DeliveryNoticeController {
  constructor(private deliveryNoticeService: DeliveryNoticeService) {}

  @ApiOperation({ title: '获得deliveryNotice资料' })
  @ApiResponse({
    status: 200,
    description: `[DeliveryNotice]`,
  })
  @ApiResponse({ status: 400, description: 'getDeliveryNotice fail' })
  @Get()
  async getDeliveryNotice(@Query() query) {
    let result;
    result = await this.deliveryNoticeService.find(query);
    return {
      status: 1,
      response: result.rows,
    };
  }

  @Post()
  @ApiOperation({ title: '新增或更新Data Drive资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `id`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async update(@Body() body: DeliveryNotice, @UserID() userId) {
    if (body && body.DELIVERY_ID > 0) {
      await this.deliveryNoticeService.update(
        {
          columns: { ...body },
          where: {
            DELIVERY_ID: body.DELIVERY_ID,
          },
        },
        userId,
      );
      return body.DELIVERY_ID;
    } else {
      const res = await this.deliveryNoticeService.insert(body, userId, {
        beforeUpdate: (data: DeliveryNotice) => {
          data.DELIVERY_NO = moment().format('YYYYMMDD') + data.DELIVERY_ID;
          return data;
        },
      });
      return res;
    }
  }

  @Delete()
  @ApiOperation({ title: '删除asn_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteMstById(@Query('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }
    const result = await this.deliveryNoticeService.delete(id);
    return {
      status: 1,
      response: `${result.rowsAffected} row(s) deleted.`,
    };
  }

  @Get('deports')
  @ApiOperation({ title: '获得RECEIVING DEPORT 的明细表' })
  async getDeports() {
    return await this.deliveryNoticeService.getDeportList();
  }

  @Get('invno')
  getInvNo(@Query('lotno') no: string) {
    return this.deliveryNoticeService.getInvMstBylotNo(no);
  }

  @Get('asn')
  async getAsnForDeliveryNotice(@Query() query) {
    return await this.deliveryNoticeService.getAsnForDeliveryNotice(query);
  }
}
