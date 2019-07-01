import { JwtGuard } from './../../guard/jwt.guard';
import { HttpExceptionFilter } from './../../shared/filters/http-exception.filter';

import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ShippingInstructionService } from './shipping-instruction.service';
import { UserID } from '../../shared/decorators';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('shipping')
@Controller('/shipping')
@Controller()
export class ShippingInstructionController {
  constructor(private shippingInstructionService: ShippingInstructionService) {}

  @ApiOperation({ title: '获得料號資料，for出貨指令' })
  @ApiResponse({
    status: 200,
  })
  @Get('parts')
  async getDeliveryNotice(@Query() query) {
    let result;
    const { lot_no, type } = query;
    if (+type === 1) {
      result = await this.shippingInstructionService.getPartWhileWhole(lot_no);
    } else {
      result = await this.shippingInstructionService.getPartWhilePartial(
        lot_no,
      );
    }
    return result;
  }

  @ApiOperation({ title: '更新及插入出貨指令' })
  @ApiResponse({
    status: 200,
  })
  @Post('instruction')
  async updateInstruction(@Body() body, @UserID() userID) {
    let result;
    const { OUTBOUND_TYPE } = body;
    if (OUTBOUND_TYPE === 'W') {
      result = await this.shippingInstructionService.updateInstructionWhileWhole(
        body,
        userID,
      );
    } else {
      result = await this.shippingInstructionService.updateInstructionWhilePartial(
        body,
        userID,
      );
    }
    return result;
  }

  @ApiOperation({ title: '刪除出貨指令' })
  @ApiResponse({
    status: 200,
  })
  @Delete('instruction')
  async deleteInstruction(@Query() query) {
    const result = await this.shippingInstructionService.deleteInstruction(
      query,
    );
    return result;
  }

  @Get('instruction/asn')
  async getAsnForInstruction(@Query() query) {
    return await this.shippingInstructionService.getAsnForInstruction(query);
  }

  @Get('instruction/reports')
  async getInstructionReport(@Query() query) {
    return await this.shippingInstructionService.getInstructionReport(query);
  }
}
