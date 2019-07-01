import { HttpExceptionFilter } from './../../shared/filters/http-exception.filter';
import { JwtGuard } from './../../guard/jwt.guard';
import { UrgentShipmentService } from './urgent-shipment.service';

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserID } from '../../shared/decorators';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('urgent')
@Controller('/urgent')
@Controller()
export class UrgentShipmentController {
  constructor(private urgentShipmentService: UrgentShipmentService) {}

  @ApiOperation({ title: '获得急料资料' })
  @ApiResponse({
    status: 200,
  })
  @Get()
  async getUrgent(@Query() query) {
    let result;
    result = await this.urgentShipmentService.getMyUrgent(query);
    return result;
  }

  @ApiOperation({ title: '获得急料詳細资料' })
  @ApiResponse({
    status: 200,
  })
  @Get('/details')
  async getDetailUrgent(@Query() query) {
    let result;
    result = await this.urgentShipmentService.getDetailUrgent(query);
    return result;
  }

  @ApiOperation({ title: '插入急料资料' })
  @ApiResponse({
    status: 200,
  })
  @Post()
  async insertUrgent(@Body() body, @UserID() userID) {
    let result;
    result = await this.urgentShipmentService.insertUrgent(body, userID);
    return result;
  }

  @ApiOperation({ title: '更新急料资料' })
  @ApiResponse({
    status: 200,
  })
  @Put()
  async updateUrgent(@Body() body, @UserID() userID) {
    let result;
    result = await this.urgentShipmentService.updateUrgent({
      columns: { ...body },
      where: {
        ID: body.ID,
      },
    }, userID);
    return result;
  }
}
