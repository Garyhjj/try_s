import { JwtGuard } from './../../guard/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Request,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ControlPartInterface } from './control-part.dto';
import { ControlPartService } from './control-part.service';

@UseGuards(JwtGuard)
@ApiUseTags('controlPart')
@Controller('/controlPart')
export class ControlPartController {
  constructor(private controlPartService: ControlPartService) {}

  /**
   * 获取所有MHUB_CONTROL_PARTS的资料
   * Example Get http://localhost:3000/controlPart?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得MHUB_CONTROL_PARTS资料' })
  @ApiResponse({
    status: 200,
    description: `[ControlPartInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllControlPartfail' })
  @Get()
  async getAllControlPart(@Query() query) {

    let result;
    try {
      result = await this.controlPartService.getAllControlPart(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getAllControlPart fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 新增或者更新MHUB_CONTROL_PARTS资料，栏位不区分大小写
   * Example Post http://localhost:3000/controlPart
   * @param body 要insert或者update的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({
    title: '新增或者更新MHUB_CONTROL_PARTS资料，栏位不区分大小写',
  })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createControlPart(@Body() body: ControlPartInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      if (body && body.ID > 0) {
        const result = await this.controlPartService.updateControlPart(
          {
            columns: { ...body },
            where: {
              id: body.ID,
            },
          },
          userId,
        );
        return {
          status: 1,
          response: `${result.rowsAffected} row(s) updated.`,
        };
      } else {
        await this.controlPartService.createControlPart(body, userId);
        return {
          status: 1,
          response: 'Insert OK',
        };
      }
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * by ID 删除MHUB_CONTROL_PARTS资料,栏位不区分大小写
   * Example Delete http://localhost:3000/controlPart/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除MHUB_CONTROL_PARTS资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteControlPartById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.controlPartService.deleteControlPartById(id);
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
