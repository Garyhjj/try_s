import { JwtGuard } from './../../guard/jwt.guard';
import { MhubInvoiceListInterface } from './invlist.dto';
import { InvListService } from './invlist.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiUseTags('invlist')
@Controller('/invlist')
export class InvListController {
  constructor(private invListService: InvListService) { }

  /**
   * 獲取OUTBOUNT INV DATA
   * Example GET http://localhost:3000/invlist/getOutInvData?
   * @param query customerCode, buycom, selCom, lotNO, invNO, oldLotNO
   * @param req 获取userId
   */
  @Get('/getOutInvData')
  @ApiOperation({ title: '獲取OUTBOUNT INV DATA' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getOutInvData(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const customerCode: string = query.customerCode ? query.customerCode : '';
    const buycom: string = query.buycom ? query.buycom : '';
    const selCom: string = query.selCom ? query.selCom : '';
    const lotNO: string = query.lotNO ? query.lotNO : '';
    const invNO: string = query.invNO ? query.invNO : '';
    const oldLotNO: string = query.oldLotNO ? query.oldLotNO : '';
    const mawb: string = query.mawb ? query.mawb : '';
    const hawb: string = query.hawb ? query.hawb : '';
    try {
      const res = await this.invListService.getOutInvData(
        customerCode,
        buycom,
        selCom,
        lotNO,
        invNO,
        oldLotNO,
        mawb,
        hawb,
      );
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取OUTBOUNT INV HEADER DATA
   * Example GET http://localhost:3000/invlist/getInvHeaData?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/getInvHeaData')
  @ApiOperation({ title: '獲取OUTBOUNT INV DATA' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getInvHeaData(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const lotNO: string = query.lotNO ? query.lotNO : '';
    const invNO: string = query.invNO ? query.invNO : '';
    try {
      const res = await this.invListService.getInvHeaData(lotNO, invNO);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取OUTBOUNT INV DETAIL DATA
   * Example GET http://localhost:3000/invlist/getInvDtlData?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/getInvDtlData')
  @ApiOperation({ title: '獲取OUTBOUNT INV DETAIL DATA' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getInvDtlData(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const lotNo: string = query.lotNo ? query.lotNo : '';
    const invNo: string = query.invNo ? query.invNo : '';
    try {
      const res = await this.invListService.getInvDtlData(lotNo, invNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 產生初始 invlist資料
   * Example GET http://localhost:3000/packlist
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/createInvlist')
  @ApiOperation({ title: '產生初始invlist資料' })
  @ApiResponse({
    status: 200,
    description: `Create OK`,
  })
  @ApiResponse({ status: 400, description: 'Create fail' })
  async createData(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const outLotNo: string = query.outLotNo ? query.outLotNo : '';
    try {
      const res = await this.invListService.createData(outLotNo, userId);
      return {
        status: 1,
        response: res,
      };
    } catch (e) {
      throw new HttpException('Create fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根據OutLot查詢invlist資料
   * Example GET http://localhost:3000/getListByLot
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/getListByLot')
  @ApiOperation({ title: '根據OutLot查詢invlist資料' })
  @ApiResponse({
    status: 200,
    description: `Select OK`,
  })
  @ApiResponse({ status: 400, description: 'Select fail' })
  async getListByLot(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const lotNo: string = query.lotNo ? query.lotNo : '';
    try {
      const res = await this.invListService.getListByLot(lotNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('Select fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新invlist资料,栏位不区分大小写
   * Example Post http://localhost:3000/invlist
   * {
   *   "columns":{
   *    },
   *   "where":{
   *    }
   * }
   * @param body 传递过来要更新的栏位，如果没有LAST_UPDATED_DATE LAST_UPDATED_BY则自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '更新invlist资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateMst(@Body() body: MhubInvoiceListInterface[], @Request() req) {
    /* if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
       throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
     }*/
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result: any = await this.invListService.updateMst(body, userId);
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
   *  更新MHUB_INVOICE_LIST.TOTAL_GROSS_WEIGHT欄位資料
   * Example GET http://localhost:3000/packlist
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/updateWeight')
  @ApiOperation({ title: '更新MHUB_INVOICE_LIST.TOTAL_GROSS_WEIGHT欄位資料' })
  @ApiResponse({
    status: 200,
    description: `Update OK`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateWeight(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const outLotNo: string = query.outLotNo ? query.outLotNo : '';
    try {
      const res = await this.invListService.updateWeight(outLotNo, userId);
      return {
        status: 1,
        response: res,
      };
    } catch (e) {
      throw new HttpException('Update fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *  更新MHUB_INVOICE_LIST.FLAG欄位,让资料重抛ERP
   * Example GET http://localhost:3000/packlist
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/updateStatus')
  @ApiOperation({ title: '更新MHUB_INVOICE_LIST.FLAG欄位' })
  @ApiResponse({
    status: 200,
    description: `Update OK`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateStatus(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const outLotNo: string = query.outLotNo ? query.outLotNo : '';
    try {
      const res = await this.invListService.updateStatus(outLotNo, userId);
      return {
        status: 1,
        response: res,
      };
    } catch (e) {
      throw new HttpException('Update fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根據OutLot查詢invlist Print資料
   * Example GET http://localhost:3000/packlist
   * @param query 查詢條件
   * @param req 获取userId
   */
  @Get('/getInvHea')
  @ApiOperation({ title: '根據OutLot查詢invlist Print資料' })
  @ApiResponse({
    status: 200,
    description: `Select OK`,
  })
  @ApiResponse({ status: 400, description: 'Select fail' })
  async getInvHea(@Query() query, @Request() req) {
    const lotNo: string = query.lotNo ? query.lotNo : '';
    try {
      const res = await this.invListService.getInvHea(lotNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('Select fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根據OutLot查詢invlist Print資料
   * Example GET http://localhost:3000/packlist
   * @param query 查詢條件
   * @param req 获取userId
   */
  @Get('/getPrintInvDtl')
  @ApiOperation({ title: '根據OutLot查詢invlist Print資料' })
  @ApiResponse({
    status: 200,
    description: `Select OK`,
  })
  @ApiResponse({ status: 400, description: 'Select fail' })
  async getPrintInvDtl(@Query() query, @Request() req) {
    const lotNo: string = query.lotNo ? query.lotNo : '';
    try {
      const res = await this.invListService.getPrintInvDtl(lotNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('Select fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取OUTBOUND REPORT FOR LOT NO NEW 信息
   * Example GET http://localhost:3000/packlist/ReportInf?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/ReportInf')
  @ApiOperation({ title: '報關PDF文件' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getReportInf(@Query() query, @Request() req) {
    try {
      return await this.invListService.getReportInf(query);
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * by ID 删除MHUB_INVOICE_LIST资料,栏位不区分大小写
   * Example Delete http://localhost:3000/invlist/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除MHUB_INVOICE_LIST资料,栏位不区分大小写' })
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
      const result = await this.invListService.deleteMstById(id);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) deleted.`,
      };
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
