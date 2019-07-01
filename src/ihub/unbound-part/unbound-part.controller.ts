import { JwtGuard } from './../../guard/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UnboundPartService } from './unbound-part.service';
import { UnboundPartInterface } from './unbound-part.dto';

@UseGuards(JwtGuard)
@ApiUseTags('unboundPart')
@Controller('/unboundPart')
export class UnboundPartController {
  constructor(private unboundPartService: UnboundPartService) {}

  /**
   * 获取所有MHUB_UNBOUND_PART的资料
   * Example Get http://localhost:3000/unboundPart?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得MHUB_UNBOUND_PART资料' })
  @ApiResponse({
    status: 200,
    description: `[UnboundPartInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllUnboundPartfail' })
  @Get()
  async getAllUnboundPart(@Query() query) {
    let result;
    try {
      result = await this.unboundPartService.getAllUnboundPart(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getAllUnboundPart fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 新增或者更新MHUB_UNBOUND_PART资料，栏位不区分大小写
   * Example Post http://localhost:3000/unboundPart
   * @param body 要insert或者update的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({
    title: '新增或者更新MHUB_UNBOUND_PART资料，栏位不区分大小写',
  })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createUnboundPart(@Body() body: UnboundPartInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      if (body && body.ID > 0) {
        const result = await this.unboundPartService.updateUnboundPart(
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
        await this.unboundPartService.createUnboundPart(body, userId);
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
   * by ID 删除MHUB_UNBOUND_PART资料,栏位不区分大小写
   * Example Delete http://localhost:3000/unboundPart/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除MHUB_UNBOUND_PART资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteUnboundPartById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.unboundPartService.deleteUnboundPartById(id);
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
