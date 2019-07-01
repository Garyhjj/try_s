import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
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
import { CommonService } from './common.service';

@UseGuards(JwtGuard)
@ApiUseTags('common')
@Controller('/common')
export class CommonController {
  constructor(private commonService: CommonService) {}

  /**
   * MSL Import Materiel Report
   * Example Get http://localhost:3000/common/GetImportMaterielReport?LOT_NO={LOT_NO}&SO_NO={SO_NO}&MHK_ETD={MHK_ETD}&SITE=XXX
   */
  @ApiOperation({ title: 'MSL Import Materiel Report' })
  @ApiResponse({
    status: 200,
    description: `[PoDtlInterface]`,
  })
  @ApiResponse({ status: 400, description: 'GetImportMaterielReport fail' })
  @Get('/GetImportMaterielReport')
  async GetImportMartialReport(@Query() query) {
    let result;
    try {
      result = await this.commonService.GetImportMaterielReport(
        query.LOT_NO,
        query.SO_NO,
        query.MHK_ETD,
        query.SITE,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'GetImportMaterielReport fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * MSL Import Report
   * Example Get http://localhost:3000/common/GetImportReport?LOT_NO={LOT_NO}&MHK_ETD={MHK_ETD}&SHIP_VIA={SHIP_VIA}&SITE=XXX
   */
  @ApiOperation({ title: 'MSL Import Report' })
  @ApiResponse({
    status: 200,
    description: `[PoDtlInterface]`,
  })
  @ApiResponse({ status: 400, description: 'GetImportReport fail' })
  @Get('/GetImportReport')
  async GetImportReport(@Query() query) {
    let result;
    try {
      result = await this.commonService.GetImportReport(
        query.LOT_NO,
        query.MHK_ETD,
        query.SHIP_VIA,
        query.SITE,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'GetImportReport fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * MSL Import Materiel Report
   * Example Get http://localhost:3000/common/GetCloseUnproductiveMaterial?out_lot_no={out_lot_no}&in_lot_no={in_lot_no}
   */
  @ApiOperation({ title: 'Close Unproductive Material' })
  @ApiResponse({
    status: 200,
    description: `[PoDtlInterface]`,
  })
  @ApiResponse({
    status: 400,
    description: 'GetCloseUnproductiveMaterial fail',
  })
  @Get('/GetCloseUnproductiveMaterial')
  async GetCloseUnproductiveMaterial(@Query() query) {
    let result;
    try {
      result = await this.commonService.GetCloseUnproductiveMaterial(
        query.out_lot_no,
        query.in_lot_no,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'GetCloseUnproductiveMaterial fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
