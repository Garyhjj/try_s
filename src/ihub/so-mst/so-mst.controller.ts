import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SoMstService } from './so-mst.service';
import { SoMstInterface } from './so-mst.dot';

@UseGuards(JwtGuard)
@ApiUseTags('mhub_so_mst')
@Controller('/mhub_so_mst')
export class SoMstController {
  constructor(private soMstService: SoMstService) {}

  /**
   * 获取已產生的SO的资料
   * Example Get http://localhost:3000/mhub_so_mst?so_no=S18121205&lot_no=
   */
  @ApiOperation({ title: '获得已產生SO的资料' })
  @ApiResponse({
    status: 200,
    description: `[SoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getSoMSt fail' })
  @Get()
  async getSoMSt(@Query() query) {
    let result;
    try {
      result = await this.soMstService.getSoMst(query.so_no, query.lot_no);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getSoMSt fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取未產生SO的资料
   * Example Get http://localhost:3000/mhub_so_mst/getSoMstByLot?lot_no=xxx
   */
  @ApiOperation({ title: '根據未產生SO的资料' })
  @ApiResponse({
    status: 200,
    description: `[SoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getSoMstByLot fail' })
  @Get('/getSoMstByLot')
  async getSoMstByLot(@Query() query) {
    let result;
    try {
      result = await this.soMstService.getSoMstByLot(query.lot_no);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getSoMstByLot fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取SO號碼
   * Example Get http://localhost:3000/mhub_so_mst/getSoNo?ship_via=xxx
   */
  @ApiOperation({ title: '產生SO號碼' })
  @ApiResponse({
    status: 200,
    description: `[SoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getSoNo fail' })
  @Get('/getSoNo')
  async getSoNo(@Query() query) {
    let result;
    try {
      result = await this.soMstService.getSoNo(query.ship_via);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getSoNo fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增mhub_so_mst资料，栏位不区分大小写
   * Example Post http://localhost:3000/mhub_so_mst
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增mhub_so_mst资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createSoMst(@Body() body: SoMstInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const asn = await this.soMstService.createSoMst(body, userId);
      return {
        status: 1,
        response: asn,
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新mhub_so_mst资料,栏位不区分大小写
   * Example Put http://localhost:3000/mhub_so_mst
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
  @ApiOperation({ title: '更新mhub_so_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateSoMst(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.soMstService.updateSoMst(body, userId);
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
   * 新增mhub_so_dtl,
   * Example Put http://localhost:3000/mhub_so_mst/insertSoDtl
   */
  @Put('/insertSoDtl')
  @ApiOperation({ title: '新增mhub_so_dtl,' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async insertSoDtl(@Body() body) {
    try {
      const result = await this.soMstService.insertSoDtl(
        body.customer,
        body.seller,
        body.buyer,
        body.so_no,
        body.so_line,
        body.lot_no,
        body.ship_via,
        body.user_id,
      );
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
   * 更新mhub_asn_mst中的so_rec,
   * Example Put http://localhost:3000/mhub_so_mst/updateSoRec
   */
  @Put('/updateSoRec')
  @ApiOperation({ title: '更新mhub_asn_mst中的so_rec,' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateSoRec(@Body() body) {
    try {
      const result = await this.soMstService.updateSoRec(
        body.lot_no,
        body.so_no,
      );
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
   * 發送So的pdf檔
   * @param query
   */
  @Get('sendSoMail')
  async sendSoMail(@Query() query) {
    const so_no = query.so_no;

    let result;
    try {
      result = await this.soMstService.sendSoMail(so_no);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('sendSoMail fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 取消 mhub_so_mst的vendor_so资料,
   * Example Put http://localhost:3000/mhub_label/cancelSoMst?so_id=123
   */
  @Put('/cancelSoMst')
  @ApiOperation({ title: '取消 mhub_so_mst的vendor_so资料,' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async cancelSoMst(@Body() body) {
    try {
      const result = await this.soMstService.cancelSoMst(body.so_id, body.so_no);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) updated.`,
      };
      // return `${result.rowsAffected} row(s) updated.`;
    } catch (e) {
      throw new HttpException('Update fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
