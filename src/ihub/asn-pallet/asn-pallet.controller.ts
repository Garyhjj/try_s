import { DeleteObject } from './../../class/delete-object.class';
import { JwtGuard } from './../../guard/jwt.guard';
import { UpdateObject } from './../../class/update-object.class';
import { AsnPalletInterface } from './asn-pallet.dto';
import { AsnPalletService } from './asn-pallet.service';
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
@ApiUseTags('asn_pallet')
@Controller('/asn_pallet')
export class AsnPalletController {
  constructor(private palletService: AsnPalletService) {}

  /**
   * 获取所有asn_pallet的资料
   * Example Get http://localhost:3000/asn_pallet?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得asn_pallet资料' })
  @ApiResponse({
    status: 200,
    description: `[AsnPalletInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllPallet fail' })
  @Get()
  async getAllPallet(@Query() query) {
    let result;
    try {
      result = await this.palletService.searchPallets(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllPallet fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('vpart')
  async getVpartNo() {
    const res = await this.palletService.getVpartNo();
    return {
      status: 1,
      response: res.rows,
    };
  }

  /**
   * 获取指定asn_pallet的资料
   * Example Get http://localhost:3000/asn_pallet/info?lotno=P123456
   */
  @ApiOperation({ title: '获取指定asn_pallet资料' })
  @ApiResponse({
    status: 200,
    description: `[AsnPalletInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllPallet fail' })
  @Get('/info')
  async getPalletInfo(@Query('lotno') lotno) {
    let result;
    try {
      // result = await this.palletService.searchPallets(query);
      result = await this.palletService.getPalletInfo(lotno);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllPallet fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ title: '根据LOT NO按料号汇总信息' })
  @ApiResponse({
    status: 200,
    description: `[]`,
  })
  @ApiResponse({ status: 400, description: 'sumpart fail' })
  @Get('/sumpart')
  async getSumPart(@Query('lotno') lotno) {
    let result;
    try {
      // result = await this.palletService.searchPallets(query);
      result = await this.palletService.sumPart(lotno);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getSumPart fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  // /**
  //  * 根据id获取asn_pallet资料
  //  * Example：Get http://localhost:3000/asn_pallet/24
  //  * @param param 获取参数id
  //  */
  // @Get(':id')
  // @ApiOperation({ title: '根据id获取asn_pallet资料' })
  // @ApiResponse({
  //   status: 200,
  //   description: `[AsnPalletInterface]`,
  // })
  // @ApiResponse({ status: 400, description: 'getPalletById fail' })
  // async getPalletById(@Param('id') id: string) {
  //   if (isNaN(+id)) {
  //     throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     const result = await this.palletService.getPalletById(+id);
  //     return {
  //       status: 1,
  //       response: result.rows,
  //     };
  //   } catch (e) {
  //     throw new HttpException('getPalletById fail' + e, HttpStatus.BAD_REQUEST);
  //   }
  // }

  /**
   * 新增asn_pallet资料，栏位不区分大小写
   * Example Post http://localhost:3000/asn_pallet
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增asn_pallet资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createPallet(@Body() body: AsnPalletInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      await this.palletService.createPallet(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增asn_dtl和asn_pallet资料，栏位不区分大小写
   * Example Post http://localhost:3000/asn_pallet/dtl
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post('dtl')
  @ApiOperation({ title: '新增asn_dtl和asn_pallet资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createDtlAndPallet(@Body() body: AsnPalletInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      await this.palletService.createDtlAndPallet(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新asn_pallet资料,栏位不区分大小写
   * Example Put http://localhost:3000/asn_pallet
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
  @ApiOperation({ title: '更新asn_pallet资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updatePallet(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.palletService.updatePallet(body, userId);
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
   * by ID 删除asn_pallet资料,栏位不区分大小写
   * Example Delete http://localhost:3000/asn_pallet/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除asn_pallet资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deletePalletById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.palletService.deletePalletById(id);
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
   * 删除asn_pallet资料,栏位不区分大小写
   * Example Delete http://localhost:3000/asn_pallet
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
  @ApiOperation({ title: '删除asn_pallet资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deletePallet(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.palletService.deletePallet(body);
      return {
        status: 1,
        response: `${result.rowsAffected} row(s) deleted.`,
      };
      // return `${result.rowsAffected} row(s) deleted.`;
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/getTotalPalletGW')
  @ApiOperation({ title: '获取pallet的total G.W' })
  @ApiResponse({
    status: 200,
    description: ``,
  })
  @ApiResponse({ status: 400, description: 'getTotalPalletGW fail' })
  async getTotalPalletGW(@Query() query) {
    const res = await this.palletService.getTotalPalletGW(query.lotNo);
    return {
      status: 1,
      response: res.rows,
    };
  }
}
