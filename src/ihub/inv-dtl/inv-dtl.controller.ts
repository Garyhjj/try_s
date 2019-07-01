import { CommonService } from './../shared/common.service';
import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import { InvDtlInterface } from './inv-dtl.dto';
import { InvDtlService } from './inv-dtl.service';
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
@ApiUseTags('inv_dtl')
@Controller('/inv_dtl')
export class InvDtlController {
  constructor(
    private invDtlService: InvDtlService,
    private commonService: CommonService,
  ) {}

  /**
   * 获取所有inv_Dtl的资料
   * Example Get http://localhost:3000/inv_Dtl?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得inv_Dtl资料' })
  @ApiResponse({
    status: 200,
    description: `[InvDtlInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllInvDtl fail' })
  @Get()
  async getAllInvDtl(@Query() query) {
    let result;
    try {
      result = await this.invDtlService.searchInvDtls(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllInvDtl fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增inv_Dtl资料，栏位不区分大小写
   * Example Post http://localhost:3000/inv_Dtl
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增inv_Dtl资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createInvDtl(@Body() body: InvDtlInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      await this.invDtlService.createInvDtl(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 通过MHUB_ASN_PKG.CREATE_INV_DTL新增inv_Dtl资料
   * Example Post http://localhost:3000/inv_dtl/v2
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post('/v2')
  @ApiOperation({ title: '通过MHUB_ASN_PKG.CREATE_INV_DTL新增inv_Dtl资料' })
  @ApiResponse({
    status: 200,
    description: `OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async insertInvDtl(@Body() body, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < body.length; i++) {
        await this.invDtlService.insertInvDtl(
          body[i].LOT_NO,
          body[i].PO_NUMBER,
          body[i].PO_SNO,
          body[i].PO_BU,
          body[i].RECEIVED_QTY,
          body[i].INV_NO,
          body[i].KPO_NO,
          body[i].KPO_SNO,
        );
      }
      return {
        status: 1,
        response: 'Insert OK',
      };
      // const res = await this.invDtlService.insertInvDtl(
      //   body.LOT_NO,
      //   body.PO_NUMBER,
      //   body.PO_SNO,
      //   body.PO_BU,
      //   body.RECEIVED_QTY,
      //   body.INV_NO,
      // );
      // // console.log(res);
      // if (res === 'OK') {
      //   return {
      //     status: 1,
      //     response: 'Insert OK',
      //   };
      // } else {
      //   return {
      //     status: 0,
      //     response: res,
      //   };
      // }
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 验证inv_dtl的资料是否正常，正常才执行插入
   * Example Post http://localhost:3000/inv_dtl/v2
   * @param body 检查的参数
   * @param req 获取userId
   */
  @Post('/v2/check')
  @ApiOperation({ title: '通过MHUB_ASN_PKG.CREATE_INV_DTL新增inv_Dtl资料' })
  @ApiResponse({
    status: 200,
    description: `OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async checkBeforeInsertInvDtl(@Body() body, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    let result: string;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < body.length; i++) {
      const res = await this.invDtlService.checkBeforeInsertInvDtl(
        body[i].LOT_NO,
        body[i].PO_NUMBER,
        body[i].PO_SNO,
        body[i].PO_BU,
        body[i].RECEIVED_QTY,
        body[i].INV_NO,
      );
      if (res !== 'OK') {
        result = res;
        break;
      }
    }
    if (result) {
      return {
        status: 0,
        response: result,
      };
    } else {
      return {
        status: 1,
        response: 'OK',
      };
    }
  }

  /**
   * 更新inv_Dtl资料,栏位不区分大小写
   * Example Put http://localhost:3000/inv_Dtl
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
  @ApiOperation({ title: '更新inv_Dtl资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateInvDtl(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.invDtlService.updateInvDtl(body, userId);
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
   * by ID 删除inv_Dtl资料,栏位不区分大小写
   * Example Delete http://localhost:3000/inv_Dtl/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除inv_Dtl资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteInvDtlById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.invDtlService.deleteInvDtlById(id);
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
   * 删除inv_Dtl资料,栏位不区分大小写
   * Example Delete http://localhost:3000/inv_Dtl
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
  @ApiOperation({ title: '删除inv_Dtl资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteInvDtl(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.invDtlService.deleteInvDtl(body);
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
   * Example Get http://localhost:3000/inv_Dtl?pi=1&ps=1&orderby=id desc
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
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllInvDtl fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
