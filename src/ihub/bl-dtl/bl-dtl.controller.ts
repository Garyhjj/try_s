import { BlDtlInterface } from './bl-dtl.dto';
import { BlDtlService } from './bl-dtl.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Request,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateObject } from '../../class/update-object.class';
import { DeleteObject } from '../../class/delete-object.class';
import { JwtGuard } from '../../guard/jwt.guard';

@UseGuards(JwtGuard)
@ApiUseTags('bl_dtl')
@Controller('/bl_dtl')
export class BlDtlController {
  constructor(private dtlService: BlDtlService) { }

  /**
   * 获取所有bl_dtl的资料
   * Example Get http://localhost:3000/bl_dtl?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得bl_dtl资料' })
  @ApiResponse({
    status: 200,
    description: `[BlDtlInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllDataDrive fail' })
  @Get()
  async getAllDtl(@Query() query) {
    let result;
    try {
      result = await this.dtlService.searchDtls(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAlldtl fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增bl_dtl资料，栏位不区分大小写
   * Example Post http://localhost:3000/bl_dtl
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增bl_dtl资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createDtl(@Body() body: BlDtlInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      await this.dtlService.createDtl(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新bl_dtl资料,栏位不区分大小写
   * Example Put http://localhost:3000/bl_dtl
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
  @ApiOperation({ title: '更新bl_dtl资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateDtl(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.dtlService.updateDtl(body, userId);
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
   * by ID 删除bl_dtl资料,栏位不区分大小写
   * Example Delete http://localhost:3000/bl_dtl/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除bl_dtl资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteDtlById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.dtlService.deleteDtlById(id);
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
   * 删除bl_dtl资料,栏位不区分大小写
   * Example Delete http://localhost:3000/bl_dtl
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
  @ApiOperation({ title: '删除bl_dtl资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteDtl(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.dtlService.deleteDtl(body);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) deleted.`,
      };
      // return `${result.rowsAffected} row(s) deleted.`;
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  // /**
  //  * 根据id获取bl_dtl资料
  //  * Example：Get http://localhost:3000/bl_dtl/24
  //  * @param param 获取参数id
  //  */
  // @Get('/:id')
  // @ApiOperation({ title: '根据id获取bl_dtl资料' })
  // @ApiResponse({
  //   status: 200,
  //   description: `[
  //       {
  //         "ID": 63,
  //         "TITLE": "abc",
  //         "REF_DEPT": null,
  //         "CODE": null,
  //         "VERSION": null,
  //         "TIME": null,
  //         "PASS_SCORE": null,
  //         "CREATION_DATE": "2018-05-31T14:57:32.000Z",
  //         "CREATION_BY": -1,
  //         "LAST_UPDATED_DATE": "2018-05-31T14:57:32.000Z",
  //         "LAST_UPDATED_BY": -1,
  //         "COMPANY_ID": null,
  //         "FLAG": null
  //       }
  //     ]`,
  // })
  // @ApiResponse({ status: 400, description: 'getdtlById fail' })
  // async getdtlById(@Param('id') id: string) {
  //   if (isNaN(+id)) {
  //     throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     const result = await this.dtlService.getdtlById(+id);
  //     return {
  //       status: 1,
  //       response: result.rows,
  //     };
  //   } catch (e) {
  //     throw new HttpException('getdtlById fail' + e, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
