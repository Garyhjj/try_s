import { DataDriveService } from './data-drive.service';
import { DataDriveInterface } from './data-drive.dto';

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

@UseGuards(JwtGuard)
@ApiUseTags('SystemOperation/GetDataDrives')
@Controller('/SystemOperation/GetDataDrives')
@Controller()
export class DataDriveController {
  constructor(private dataDriveService: DataDriveService) {}

  /**
   * 获取所有Data Drive的资料
   * Example Get http://localhost:3000/datadrive?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得datadrive资料' })
  @ApiResponse({
    status: 200,
    description: `[DataDriveInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllDataDrive fail' })
  @Get()
  async getAllDataDrive(@Query() query) {
    let result;
    try {
      result = await this.dataDriveService.searchDataDrives(query);
      return result.rows;
    } catch (e) {
      throw new HttpException(
        'getAllDataDrive fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // /**
  //  * 根据id获取Data Drive资料
  //  * Example：Get http://localhost:3000/datadrive/24
  //  * @param param 获取参数id
  //  */
  // @Get(':id')
  // @ApiOperation({ title: '根据id获取Data Drive资料' })
  // @ApiResponse({
  //   status: 200,
  //   description: ` [
  //       {
  //           ID: number;
  //           DESCRIPTION?: string;
  //           MAIN_SET?: string;
  //           TABLE_DATA?: string;
  //           SEARCH_SETS?: string;
  //           UPDATE_SETS?: string;
  //           CREATION_DATE?: string;
  //           CREATION_BY?: number;
  //           LAST_UPDATED_DATE?: string;
  //           LAST_UPDATED_BY?: number;
  //           LAST_UPDATE_LOGIN?: number;
  //       }
  //     ]
  //   `,
  // })
  // @ApiResponse({ status: 400, description: 'getDataDriveById fail' })
  // async getDataDriveById(@Param('id') id: string) {
  //   if (isNaN(+id)) {
  //     throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     const result = await this.dataDriveService.getDataDriveById(+id);
  //     return {
  //       status: 1,
  //       response: result.rows,
  //     };
  //   } catch (e) {
  //     throw new HttpException(
  //       'getDataDriveById fail' + e,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  /**
   * 新增或更新Data Drive资料，栏位不区分大小写
   * Example Post http://localhost:3000/datadrive
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增或更新Data Drive资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `id`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createExam(@Body() body: DataDriveInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      if (body && body.ID > 0) {
        await this.dataDriveService.updateDataDrive(
          {
            columns: { ...body },
            where: {
              id: body.ID,
            },
          },
          userId,
        );
        return body.ID;
      } else {
        await this.dataDriveService.createDataDrive(body, userId);
        const res = await this.dataDriveService.getMaxId();
        return res.rows[0].ID;
      }
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新datadrive资料,栏位不区分大小写
   * Example Put http://localhost:3000/datadrive
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
  @ApiOperation({ title: '更新datadrive资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateExam(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.dataDriveService.updateDataDrive(body, userId);
      return { status: 1, response: `${result.rowsAffected} row(s) updated.` };
    } catch (e) {
      throw new HttpException('Update fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * by ID 删除datadrive资料,栏位不区分大小写
   * Example Delete http://localhost:3000/datadrive/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除datadrive资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteExamById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.dataDriveService.deleteDataDriveById(id);
      return { status: 1, response: `${result.rowsAffected} row(s) deleted.` };
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 删除datadrive资料,栏位不区分大小写
   * Example Delete http://localhost:3000/datadrive
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
  @ApiOperation({ title: '删除datadrive资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteExam(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.dataDriveService.deleteDataDrive(body);
      return { status: 1, response: `${result.rowsAffected} row(s) deleted.` };
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
