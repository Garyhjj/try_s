import { CommonService } from './../shared/common.service';
import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import { InvMstInterface } from './inv-mst.dto';
import { InvMstService } from './inv-mst.service';
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
@ApiUseTags('inv_mst')
@Controller('/inv_mst')
export class InvMstController {
  constructor(
    private invMstService: InvMstService,
    private commonService: CommonService,
  ) {}

  /**
   * 获取所有inv_mst的资料.
   * Example Get http://localhost:3000/inv_mst?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得inv_mst资料' })
  @ApiResponse({
    status: 200,
    description: `[InvMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllInvMst fail' })
  @Get()
  async getAllInvMst(@Query() query) {
    let result;
    try {
      result = await this.invMstService.searchInvMsts(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllInvMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 查询最近50笔的INV MST
   * Example Get http://localhost:3000/inboundlot?LOT_NO=X&INV_NO=X&CUSTOMER_CODE=X
   */
  @ApiOperation({ title: '查询最近50笔的INV MST' })
  @ApiResponse({
    status: 200,
    description: `[InvMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getCanReOpenMst fail' })
  @Get('/inboundlot')
  async inboundLot(@Query() query, @Request() req) {
    let result;
    try {
      result = await this.invMstService.getInboundInvMst(
        query.LOT_NO,
        query.INV_NO,
        query.CUSTOMER_CODE,
      );
      // console.log(result);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('reOpenMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取po line 信息
   * Example Get http://localhost:3000/inv_mst/getPoLines?po=300276290&itemno=283001000033&bu=SSU&customercode=00003
   */
  @ApiOperation({ title: '获取po line 信息' })
  @ApiResponse({
    status: 200,
    description: `[]`,
  })
  @ApiResponse({ status: 400, description: 'getPoLines fail' })
  @Get('/getPoLines')
  async getPoLines(@Query() query) {
    let result;
    try {
      result = await this.invMstService.getPoLines(
        query.po,
        query.itemno,
        query.bu,
        query.customercode,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getPoLines fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取intel po line 信息
   * Example Get http://localhost:3000/inv_mst/getPoLinesIntel?po=300276290&itemno=283001000033&bu=SSU&customercode=00003
   */
  @ApiOperation({ title: '获取intel po line 信息' })
  @ApiResponse({
    status: 200,
    description: `[]`,
  })
  @ApiResponse({ status: 400, description: 'getPoLinesIntel fail' })
  @Get('/getPoLinesIntel')
  async getPoLinesIntel(@Query() query) {
    let result;
    try {
      result = await this.invMstService.getPoLineIntel(query.itemno);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getPoLines fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增inv_mst资料，栏位不区分大小写
   * Example Post http://localhost:3000/inv_mst
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增inv_mst资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createInvMst(@Body() body: InvMstInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const r = await this.invMstService.checkBeforeInsert(body);
      if (r.rows[0].RESULT !== 'OK') {
        return {
          status: 0,
          response: r.rows[0].RESULT,
        };
      }
      body.INV_NO = body.INV_NO && body.INV_NO.trim();
      const res = await this.invMstService.createInvMst(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * 更新inv_mst资料,栏位不区分大小写
   * Example Put http://localhost:3000/inv_mst
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
  @ApiOperation({ title: '更新inv_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateInvMst(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.invMstService.updateInvMst(body, userId);
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
   * by ID 删除inv_mst资料,栏位不区分大小写
   * Example Delete http://localhost:3000/inv_mst/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除inv_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteInvMstById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.invMstService.deleteInvMstById(id);
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
   * 删除inv_mst资料,栏位不区分大小写
   * Example Delete http://localhost:3000/inv_mst
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
  @ApiOperation({ title: '删除inv_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteInvMst(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.invMstService.deleteInvMst(body);
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
   * 根据PO号码获取料号
   * Example Get http://localhost:3000/inv_mst?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '根据PO号码获取料号' })
  @ApiResponse({
    status: 200,
    description: `['283001000033']`,
  })
  @ApiResponse({ status: 400, description: 'getItemNoByPoNumber fail' })
  @Get('/getItemNo')
  async getItemNoByPoNumber(@Query() query) {
    const po = query.po;
    const lotNo = query.lotNo;
    let result;
    try {
      result = await this.commonService.getItemNoByPoNumber(po, lotNo);
      return {
        status: 1,
        response: result.rows || [],
      };
    } catch (e) {
      throw new HttpException('getAllInvMst fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * INV LIST QUIRY
   */
  @ApiOperation({ title: 'Inv list Quiry' })
  @ApiResponse({
    status: 200,
    description: `[]`,
  })
  @ApiResponse({ status: 400, description: 'invListQuiry fail' })
  @Get('invListQuiry')
  async invListQuiry(@Query() query) {
    let result;
    try {
      result = await this.invMstService.invListQuiry(
        query.seller || '',
        query.buyer || '',
        query.invNo || '',
        query.invStatus || '',
        query.lotNo || '',
        query.vendorCode || '',
        query.dateFrom || '',
        query.dateTo || '',
        query.partNo || '',
        query.poNo || '',
        query.poSno || '',
        query.pkNo || '',
        query.site || '',
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('invListQuiry fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
