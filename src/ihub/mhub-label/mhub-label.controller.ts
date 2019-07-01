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
import { MbuhLabelService } from './mhub-label.service';
import { MhubLabelInterface } from './mhub-label.dot';

@UseGuards(JwtGuard)
@ApiUseTags('mhub_label')
@Controller('/mhub_label')
export class MbuhLabelController {
  constructor(private labelService: MbuhLabelService) {}

  /**
   * 获取所有已存倉的mhub_label的资料
   * Example Get http://localhost:3000/mhub_label?pi=1&ps=1&orderby=id desc
   */
  @ApiOperation({ title: '获得MhubLabel资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllMhubLabel fail' })
  @Get()
  async getAllMhbuLabel(@Query() query) {
    let result;
    try {
      result = await this.labelService.searchMhubLabel(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getAllMhubLabel fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取mhub_label的资料
   * Example Get http://localhost:3000/mhub_label/getLabelByLot?lot_no=xxx&so_no=xxx
   */
  @ApiOperation({ title: '获取mhub_label的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getLabelByLot fail' })
  @Get('/getLabelByLot')
  async getLabelByLot(@Query() query) {
    let result;
    try {
      result = await this.labelService.getLabelByLot(query.lot_no, query.so_no);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getLabelByLot fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 根據入倉號获取mhub_label的资料
   * Example Get http://localhost:3000/mhub_label/getLabelByLot?vendor_so=xxx
   */
  @ApiOperation({ title: '获取mhub_label的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getMhubLabelByVendorSo fail' })
  @Get('/getMhubLabelByVendorSo')
  async getMhubLabelByVendorSo(@Query() query) {
    let result;
    try {
      result = await this.labelService.getMhubLabelByVendorSo(query.vendor_so);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getMhubLabelByVendorSo fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取所有存倉或未存倉mhub_label的资料
   * Example Get http://localhost:3000/mhub_label/getAllLabelIncludeNew?hawb=xxx&lot_no=xxx
   */
  @ApiOperation({ title: '根據hawb获取所有mhub_label的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllLabel fail' })
  @Get('/getAllLabelIncludeNew')
  async getAllLabelIncludeNew(@Query() query) {
    let result;
    try {
      result = await this.labelService.getAllLabelIncludeNew(
        query.hawb,
        query.lot_no,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getAllLabel fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取所有新的mhub_label的资料
   * Example Get http://localhost:3000/mhub_label/new_label?lot_no=xxx
   */
  @ApiOperation({ title: '获取所有新的mhub_label的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getNewLabel fail' })
  @Get('/new_label')
  async getNewLabel(@Query() query) {
    let result;
    try {
      result = await this.labelService.getNewLabel(query.lot_no);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getNewLabel fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增mhub_label资料，栏位不区分大小写
   * Example Post http://localhost:3000/mhub_label/insert
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post('/insert')
  @ApiOperation({ title: '新增mhub_label资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createMhubLabel(@Body() body: MhubLabelInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const res = await this.labelService.createMhubLabel(body, userId);
      return {
        status: 1,
        response: 'Insert OK',
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新mhub_label资料,栏位不区分大小写
   * Example Put http://localhost:3000/mhub_label/update
   * {
   *   "columns":{
   *    },
   *   "where":{
   *    }
   * }
   * @param body 传递过来要更新的栏位，如果没有LAST_UPDATED_DATE LAST_UPDATED_BY则自动增加
   * @param req 获取userId
   */
  @Put('/update')
  @ApiOperation({ title: '更新mhub_label资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateMhubLabel(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.labelService.updateMhubLabel(body, userId);
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
   * 获取新的VENDOR_SO
   * Example Get http://localhost:3000/mhub_label/new_vendor_so?pack_type=xxx
   */
  @ApiOperation({ title: '获取新的VENDOR_SO' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getNewSO fail' })
  @Get('/new_vendor_so')
  async getNewVendorSo(@Query() query) {
    let result;
    try {
      result = await this.labelService.getNewVendorSo(query.pack_type);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getNewSO fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新mhub_so_mst的vendor_so资料,
   * Example Put http://localhost:3000/mhub_label/update_so
   */
  @Put('/update_so_mst')
  @ApiOperation({ title: '更新mhub_so_mst的vendor_so资料,' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateSO(@Body() body) {
    try {
      const result = await this.labelService.updateSO(
        body.lot_no,
        body.so_no,
        body.vendor_so,
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
   * 获取所有待封柜的mhub_label的资料
   * Example Get http://localhost:3000/mhub_label/inventory_label?date_from=2018/09/01&date_to=2018/09/01&lot_no=xxx&so_no=xxx&vendor_so=xxx&site=MSL
   */
  @ApiOperation({ title: '获取所有待封柜的mhub_label的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getInventoryLabel fail' })
  @Get('/inventory_label')
  async getInventoryLabel(@Query() query) {
    let result;
    try {
      result = await this.labelService.getInventoryLabel(
        query.date_from,
        query.date_to,
        query.lot_no,
        query.so_no,
        query.vendor_so,
        query.site,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getInventoryLabel fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取所有已經封柜的mhub_label的资料
   * Example Get http://localhost:3000/mhub_label/getExistsInventoryLabel?container_no=xxx&&onBoardDate=onBoardDate
   */
  @ApiOperation({ title: '获取所有已經封柜的mhub_label的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getExistsInventoryLabel fail' })
  @Get('/getExistsInventoryLabel')
  async getExistsInventoryLabel(@Query() query) {
    let result;
    try {
      result = await this.labelService.getExistsInventoryLabel(
        query.container_no,
        query.onBoardDate,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getExistsInventoryLabel fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取已经裝櫃完成的资料
   * Example Get http://localhost:3000/mhub_label/getFinishLabel?onBoardDate={onBoardDate}
   */
  @ApiOperation({ title: '获取已经裝櫃完成的资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getFinishLabel fail' })
  @Get('/getFinishLabel')
  async getFinishLabel(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    try {
      result = await this.labelService.getFinishLabel(onBoardDate);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getFinishLabel fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取已经裝櫃完成的Detail资料
   * Example Get http://localhost:3000/mhub_label/getFinishLabelDetail?onBoardDate={onBoardDate}&containerNO={containerNO}
   */
  @ApiOperation({ title: '获取已经裝櫃完成的Detail资料' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getFinishLabelDetail fail' })
  @Get('/getFinishLabelDetail')
  async getFinishLabelDetail(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNO: string = query.containerNO ? query.containerNO : '';
    try {
      result = await this.labelService.getFinishLabelDetail(
        onBoardDate,
        containerNO,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getFinishLabelDetail fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 更新mhub_label的Finish狀態,
   * Example Put http://localhost:3000/mhub_label/updateLabelFinish
   */
  @Put('/updateLabelFinish')
  @ApiOperation({ title: '更新mhub_label的Finish狀態,' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateLabelFinish(@Body() body) {
    try {
      const result = await this.labelService.updateLabelFinish(
        body.onBoardDate,
        body.containerNO,
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
   * 获取Express的入倉信息
   * Example Get http://localhost:3000/mhub_label/getExpressMhubLabel?hawb=xxx&lot_no=xxx
   */
  @ApiOperation({ title: '获取Express的入倉信息' })
  @ApiResponse({
    status: 200,
    description: `[MhubLabelInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getExpressMhubLabel fail' })
  @Get('/getExpressMhubLabel')
  async getExpressMhubLabel(@Query() query) {
    let result;

    try {
      result = await this.labelService.getExpressMhubLabel(
        query.hawb,
        query.lot_no,
      );

      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getExpressMhubLabel fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 更新EXPRESS mhub_so_mst的vendor_so资料,
   * Example Put http://localhost:3000/mhub_label/updateExpressSo
   */
  @Put('/updateExpressSo')
  @ApiOperation({ title: '更新EXPRESS mhub_so_mst的vendor_so资料,' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateExpressSo(@Body() body) {
    try {
      const result = await this.labelService.updateExpressSo(
        body.lot_no,
        body.so_no,
        body.vendor_so,
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
   * Hou單據confirm到9
   * Example Get http://localhost:3000/mhub_label/houConfirm?lot_no=xxx&hawb=xxx&container_no=xxx&sec_fwd=xxx&sec_eta=2019/02/22 13:13:13&so_no=xxx
   * 执行做4动作
   * @param query
   */
  @ApiOperation({ title: 'Hou單據confirm到9' })
  @Get('houConfirm')
  async houConfirm(@Query() query) {
    let result;
    try {
      result = await this.labelService.houConfirm(query.lot_no, query.hawb, query.container_no, query.sec_fwd, query.sec_eta, query.so_no);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('confirmTo4 fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
