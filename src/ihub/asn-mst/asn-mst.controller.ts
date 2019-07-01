import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import { AsnMstInterface } from './asn-mst.dto';
import { AsnMstService } from './asn-mst.service';
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

@UseGuards(JwtGuard)
@ApiUseTags('asn_mst')
@Controller('/asn_mst')
export class AsnMstController {
  constructor(private mstService: AsnMstService) {}

  /**
   * 获取所有ASN_MST的资料
   * Example Get http://localhost:3000/asn_mst?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得asn_mst资料' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllDataDrive fail' })
  @Get()
  async getAllMst(@Query() query) {
    let result;
    try {
      result = await this.mstService.searchMsts(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 查询最近50笔状态为9的ASN MST
   * Example Get http://localhost:3000/reopen?LOT_NO=X&PK_NO=X
   */
  @ApiOperation({ title: '查询最近50笔状态为9的ASN MST' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'reOpenMst fail' })
  @Get('/reopen')
  async reOpenMst(@Query() query, @Request() req) {
    let result;
    try {
      result = await this.mstService.reOpenMstQuery(
        query.LOT_NO,
        query.PK_NO,
        req.user.UserID ? req.user.UserID : 0,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('reOpenMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Close Asn Status Query
   * Example Get http://localhost:3000/close?LOT_NO=X&PK_NO=X
   */
  @ApiOperation({ title: '查询最近50笔状态为9的ASN MST' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'closeMst fail' })
  @Get('/closequery')
  async closeMst(@Query() query, @Request() req) {
    let result;
    if (query.LOT_NO || query.PK_NO) {
      try {
        result = await this.mstService.closeQuery(
          query.LOT_NO,
          query.PK_NO,
          req.user.UserID ? req.user.UserID : 0,
        );
        return {
          status: 1,
          response: result.rows,
        };
      } catch (e) {
        throw new HttpException('reOpenMst fail ' + e, HttpStatus.BAD_REQUEST);
      }
    } else {
      return {
        status: 1,
        response: [],
      };
    }
  }

  /**
   * 关闭Lot
   * Example Get http://localhost:3000/closelot?LOT_NO=X&CUSTOMER_CODE=X&REMARK=x
   */
  @ApiOperation({ title: '关闭ASN MST' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getCanReOpenMst fail' })
  @Get('/closelot')
  async closeLot(@Query() query, @Request() req) {
    let result;
    try {
      result = await this.mstService.closeLot(
        query.LOT_NO,
        query.CUSTOMER_CODE,
        req.user.UserID ? req.user.UserID : 0,
        query.REMARK,
      );
      // console.log(result);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('reOpenMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 查询最近50笔状态为9的ASN MST
   * Example Get http://localhost:3000/openlot?LOT_NO=X&CUSTOMER_CODE=X
   */
  @ApiOperation({ title: '查询最近50笔状态为9的ASN MST' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getCanReOpenMst fail' })
  @Get('/openlot')
  async openLot(@Query() query, @Request() req) {
    let result;
    try {
      result = await this.mstService.openLot(
        query.LOT_NO,
        query.CUSTOMER_CODE,
        req.user.UserID ? req.user.UserID : 0,
      );
      // console.log(result);
      return {
        status: 1,
        response: result.status,
      };
    } catch (e) {
      throw new HttpException('reOpenMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ title: 'LOT 已经被confirm后重新变成1状态' })
  @ApiResponse({
    status: 200,
    description: `OK`,
  })
  @ApiResponse({ status: 400, description: 'modifylot fail' })
  @Get('/modifylot')
  async modifyLot(@Query() query, @Request() req) {
    const res = await this.mstService.modifyLot(query.LOT_NO);
    return {
      status: 1,
      response: res,
    };
  }

  /**
   * 获取所有open状态的ASN_MST的资料
   * Example Get http://localhost:3000/asn_mst/open?LOT_NO=xxx&PK_NO=xxx
   */
  @ApiOperation({ title: '获取所有open状态的ASN_MST的资料' })
  @ApiResponse({
    status: 200,
    description: `[AsnMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllDataDrive fail' })
  @Get('/open')
  async getAllOpenMst(@Query() query) {
    let result;
    try {
      result = await this.mstService.getAllOpenMst(
        query.LOT_NO,
        query.PK_NO,
        query.PK_STATUS,
        query.SITE,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Confirm Asn
   * Example Get http://localhost:3000/asn_mst/confirm?LOT_NO=xxx
   */
  @ApiOperation({ title: 'Confirm Asn' })
  @ApiResponse({
    status: 200,
    description: `OK | Error MSG`,
  })
  @ApiResponse({ status: 400, description: 'confirmMst' })
  @Get('/confirm')
  async confirmMst(@Query() query) {
    let result;
    try {
      result = await this.mstService.confirmAsn(query.LOT_NO);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('confirmMst ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 验证料号是否存在并返回vendor code
   * Example Get http://localhost:3000/asn_mst/checkpart?partno=H35898-001&customer_code=00003
   */
  @ApiOperation({ title: '验证料号是否存在并返回vendor code' })
  @ApiResponse({
    status: 200,
    description: `[{"PART_NO":"422C34100078","VENDOR_CODE":"35918"}]`,
  })
  @ApiResponse({ status: 400, description: 'checkPartNo fail' })
  @Get('/checkpart')
  async checkPartNo(
    @Query('partno') partno,
    @Query('customer_code') customer_code = '00003',
  ) {
    try {
      const res = await this.mstService.checkPartNo(partno, customer_code);
      return res;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/checkpart2')
  async checkPartNo2(
    @Query('partno') partno,
    @Query('customer_code') customer_code = '00003',
  ) {
    try {
      const res = await this.mstService.checkPartNo2(partno, customer_code);
      return res;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * getOutAsn
   * Example Get http://localhost:3000/asn_mst/getOutAsn/
   */
  @ApiOperation({ title: 'Get Out Asn' })
  @ApiResponse({
    status: 200,
    description: `OK | Error MSG`,
  })
  @ApiResponse({ status: 400, description: 'getOutAsn' })
  @Get('/getOutAsn')
  async getOutAsn(@Query() query) {
    let result;
    const customerCode: string = query.customerCode
      ? query.customerCode
      : '00003';
    const buycom: string = query.buycom ? query.buycom : '';
    const selCom: string = query.selCom ? query.selCom : '';
    const lotCode: string = query.lotCode ? query.lotCode : '';
    const oldLotNo: string = query.oldLotNo ? query.oldLotNo : '';
    const lotNo: string = query.lotNo ? query.lotNo : '';
    const partNo: string = query.partNo ? query.partNo : '';
    const fDocDate: string = query.fDocDate ? query.fDocDate : '';
    const tDocDate: string = query.tDocDate ? query.tDocDate : '';
    const shipVia: string = query.shipVia ? query.shipVia : '';
    const mawb: string = query.mawb ? query.mawb : '';
    const hawb: string = query.hawb ? query.hawb : '';
    const transNo: string = query.transNo ? query.transNo : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    const status: string = query.status ? query.status : '';
    const outboundType: string = query.outboundType ? query.outboundType : '';
    try {
      result = await this.mstService.getOutAsn(
        customerCode,
        buycom,
        selCom,
        lotCode,
        oldLotNo,
        lotNo,
        partNo,
        fDocDate,
        tDocDate,
        shipVia,
        mawb,
        hawb,
        transNo,
        containerNo,
        status,
        outboundType,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getOutAsn ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增asn_mst资料，栏位不区分大小写
   * Example Post http://localhost:3000/asn_mst
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增asn_mst资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createMst(@Body() body: AsnMstInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const asn = await this.mstService.createMst(body, userId);
      return {
        status: 1,
        response: asn,
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新asn_mst资料,栏位不区分大小写
   * Example Put http://localhost:3000/asn_mst
   * {
   *   "columns":{
   *    },
   *   "where":{
   *    }
   * }
   * @param body 传递过来要更新的栏位，如果没有LAST_UPDATED_DATE LAST_UPDATED_BY则自动增加
   * @param req 获取userId
   */
  @Put()
  @ApiOperation({ title: '更新asn_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateMst(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.mstService.updateMst(body, userId);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) updated.`,
      };
      // return `${result.rowsAffected} row(s) updated.`;
    } catch (e) {
      throw new HttpException('Update fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * by ID 删除asn_mst资料,栏位不区分大小写
   * Example Delete http://localhost:3000/asn_mst/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除asn_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteMstById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.mstService.deleteMstById(id);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) deleted.`,
      };
      // return `${result.rowsAffected} row(s) deleted.`;
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 删除asn_mst资料,栏位不区分大小写
   * Example Delete http://localhost:3000/asn_mst
   * {
   *   "where":{
   *    "id":"64",
   *    "title":"111222",
   *    "abc":"111"  //这个无效属性会被忽略
   *    }
   * }
   * @param body where条件
   */
  @Delete()
  @ApiOperation({ title: '删除asn_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteMst(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.mstService.deleteMst(body);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) deleted.`,
      };
      // return `${result.rowsAffected} row(s) deleted.`;
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根据PO号码获取vendor信息
   * Example Get http://localhost:3000/asn_mst/po?po=300276290
   */
  @ApiOperation({ title: '根据PO号码获取vendor信息' })
  @ApiResponse({
    status: 200,
    description: `[{"CUSTOMER_CODE":"00003","FACTORY_CODE":"00003","VENDOR_CODE":"02565",
    "VENDOR_NAME":"新加坡商安富利股份有限公司台灣分公司","PO_SIC":"P","PO_NO":"300276290"}]`,
  })
  @ApiResponse({ status: 400, description: 'getVendorByPo fail' })
  @Get('/po')
  async getVendorByPo(@Query('po') po) {
    let result;
    try {
      result = await this.mstService.getVendorByPo(po);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getVendorByPo fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取4状态且产生了outbound的资料，做9
   * @param query
   */
  @Get('status4')
  async getStauts4(@Query() query) {
    let result;
    try {
      result = await this.mstService.getStatus4(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getStauts4 fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 执行做9动作
   * @param query
   */
  @Get('confirmTo9')
  async confirmTo9(@Query() query) {
    const lotNo = query.LOT_NO;
    const outLotNo = query.OUT_LOT_NO || '';
    const customerCode = query.CUSTOMER_CODE;
    const hawb = query.HAWB || '';
    const attendant = query.ATTENDANT || '';
    const warehouseCode = query.WAREHOUSE_CODE || '';
    const mhkEtd = query.MHK_ETD || '';
    const mhkEta = query.MHK_ETA || '';
    if (!lotNo) {
      throw new HttpException('LOT_NO 是必要栏位 ', HttpStatus.BAD_REQUEST);
    }
    let result;
    try {
      result = await this.mstService.confirmTo9(
        lotNo,
        outLotNo,
        customerCode,
        hawb,
        attendant,
        warehouseCode,
        mhkEtd,
        mhkEta,
      );
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('confirmTo9 fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取2状态资料，做4，并產生Outbound
   * @param query
   */
  @Get('status2')
  async getStatus2(@Query() query) {
    let result;
    try {
      result = await this.mstService.getStatus2(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getStauts2 fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 执行做4动作
   * @param query
   */
  @Get('confirmTo4')
  async confirmTo4(@Query() query) {
    const lotNo = query.LOT_NO;
    const customerCode = query.CUSTOMER_CODE;
    if (!lotNo) {
      throw new HttpException('LOT_NO 是必要栏位 ', HttpStatus.BAD_REQUEST);
    }
    let result;
    try {
      result = await this.mstService.confirmTo4(lotNo, customerCode);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('confirmTo4 fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PK List Inquiry
   * @param query
   */
  @Get('pkListQuery')
  async pkListQuery(@Query() query) {
    const lotNo = query.LOT_NO;
    const partNo = query.PART_NO;
    const vendorCode = query.VENDOR_CODE;
    const dateFrom = query.DATE_FROM;
    const dateTo = query.DATE_TO;
    const pkStatus = query.PK_STATUS;
    const partialOrWhole = query.PW;
    const customerCode = query.CUSTOMER_CODE || '00003';
    const pkNo = query.PK_NO;
    const hawb = query.HAWB;
    const vendorName = query.VENDOR_NAME;
    const site = query.SITE;
    const result = await this.mstService.pkListQuery(
      lotNo,
      partNo,
      vendorCode,
      dateFrom,
      dateTo,
      pkStatus,
      partialOrWhole,
      customerCode,
      pkNo,
      hawb,
      vendorName,
      site,
    );
    return {
      status: 1,
      response: result,
    };
  }

  @Get('pkInvoiceQuery')
  async pkInvoiceQuery(@Query() query) {
    const lotNo = query.LOT_NO;
    const partNo = query.PART_NO;
    const vendorCode = query.VENDOR_CODE;
    const dateFrom = query.DATE_FROM;
    const dateTo = query.DATE_TO;
    const invoiceStatus = query.INVOICE_STATUS;
    const invoiceNo = query.INVOICE_NO;
    const poNo = query.PO_NO;
    const poLine = query.PO_LINE;

    const result = await this.mstService.pkInvoiceQuery(
      lotNo,
      partNo,
      vendorCode,
      dateFrom,
      dateTo,
      invoiceStatus,
      invoiceNo,
      poNo,
      poLine,
    );
    return {
      status: 1,
      response: result,
    };
  }

  @Get('performance')
  async performance(@Query() query) {
    const date = query.date;
    const weekOfday = moment(date).format('E');
    const firstDay = moment(date)
      .subtract(+weekOfday, 'days')
      .format('YYYY/MM/DD');
    // const lastDay = moment()
    //   .add(7 - +weekOfday - 1, 'days')
    //   .format('YYYY/MM/DD');
    // console.log(weekOfday, firstDay, lastDay);
    const result = await this.mstService.performance(firstDay);
    return result;
  }

  @Get('performanceDetail')
  async performanceDetail(@Query() query) {
    const date = query.date;
    const result = await this.mstService.performanceDetail(date);
    return result;
  }
}
