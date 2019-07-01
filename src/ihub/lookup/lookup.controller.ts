import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import { LookupInterface } from './lookup.dto';
import { LookupService } from './lookup.service';
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
@ApiUseTags('lookup')
@Controller('/lookup')
export class LookupController {
  constructor(private lookupService: LookupService) {}

  /**
   * 获取所有lookup的资料
   * Example Get http://localhost:3000/lookup?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得lookup资料' })
  @ApiResponse({
    status: 200,
    description: `[LookupInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllLookup fail' })
  @Get()
  async getAllLookup(@Query() query) {
    let result;
    try {
      result = await this.lookupService.searchLookups(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllLookup fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 一次性获取多个lookup的资料
   * Example Get http://localhost:3000/lookup/list?params=ASN_TYPE,SHIP_TO,SHIP_TO_FAX
   */
  @ApiOperation({ title: '一次性获取多个lookup的资料' })
  @ApiResponse({
    status: 200,
    description: `[LookupInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getLookupList fail' })
  @Get('/list')
  async getLookupList(@Query() query) {
    try {
      const result = await this.lookupService.getLookupList(query.params);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getLookupList fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // /**
  //  * 根据id获取lookup资料
  //  * Example：Get http://localhost:3000/lookup/24
  //  * @param param 获取参数id
  //  */
  // @Get(':id')
  // @ApiOperation({ title: '根据id获取lookup资料' })
  // @ApiResponse({
  //   status: 200,
  //   description: `[LookupInterface]`,
  // })
  // @ApiResponse({ status: 400, description: 'getLookupById fail' })
  // async getLookupById(@Param('id') id: string) {
  //   if (isNaN(+id)) {
  //     throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     const result = await this.lookupService.getLookupById(+id);
  //     return {
  //       status: 1,
  //       response: result.rows,
  //     };
  //   } catch (e) {
  //     throw new HttpException('getLookupById fail' + e, HttpStatus.BAD_REQUEST);
  //   }
  // }

  /**
   * 新增lookup资料，栏位不区分大小写
   * Example Post http://localhost:3000/lookup
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增lookup资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createLookup(@Body() body: LookupInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      await this.lookupService.createLookup(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新lookup资料,栏位不区分大小写
   * Example Put http://localhost:3000/lookup
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
  @ApiOperation({ title: '更新lookup资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateLookup(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.lookupService.updateLookup(body, userId);
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
   * by ID 删除lookup资料,栏位不区分大小写
   * Example Delete http://localhost:3000/lookup/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除lookup资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteLookupById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.lookupService.deleteLookupById(id);
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
   * 删除lookup资料,栏位不区分大小写
   * Example Delete http://localhost:3000/lookup
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
  @ApiOperation({ title: '删除lookup资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteLookup(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.lookupService.deleteLookup(body);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) deleted.`,
      };
      // return `${result.rowsAffected} row(s) deleted.`;
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
