import { BlMstInterface } from './bl-mst.dto';
import { BlMstService } from './bl-mst.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from '../../guard/jwt.guard';

@UseGuards(JwtGuard)
@ApiUseTags('bl_mst')
@Controller('/bl_mst')
export class BlMstController {
  constructor(private mstService: BlMstService) { }

  /**
   * 获取已经combine完成的资料
   * Example Get http://localhost:3000/bl_mst/getFinishCombine?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '已经combine完成的资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getFinishCombine fail' })
  @Get('/getFinishCombine')
  async getFinishCombine(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.getFinishCombine(onBoardDate, containerNo);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getFinishCombine fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取准备维护BL信息的资料
   * Example Get http://localhost:3000/bl_mst/getWaitBlList?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '获取准备维护BL信息的资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getWaitBlList fail' })
  @Get('/getWaitBlList')
  async getWaitBlList(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.getWaitBlList(onBoardDate, containerNo);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getWaitBlList fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取准备维护BL信息的资料
   * Example Get http://localhost:3000/bl_mst/getWaitConfirmList?dateFrom={dateFrom}&dateTo={dateTo}
   */
  @ApiOperation({ title: '获取准备Comfirm的资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getWaitConfirmList fail' })
  @Get('/getWaitConfirmList')
  async getWaitConfirmList(@Query() query) {
    let result;
    const dateFrom: string = query.dateFrom ? query.dateFrom : '';
    const dateTo: string = query.dateTo ? query.dateTo : '';
    try {
      result = await this.mstService.getWaitConfirmList(dateFrom, dateTo);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getWaitConfirmList fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取已维护BL信息的资料
   * Example Get http://localhost:3000/bl_mst/getBlList?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '获取准备维护BL信息的资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getBlList fail' })
  @Get('/getBlList')
  async getBlList(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.getBlList(onBoardDate, containerNo);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getBlList fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增MHUB_BL_MST资料，栏位不区分大小写
   * Example Post http://localhost:3000/bl_mst
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '新增bl_mst资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Insert OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  async createMst(@Body() body: BlMstInterface, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const asn = await this.mstService.createMst(body, userId);
      return {
        status: 1,
        response: asn,
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 刪除BL的资料
   * Example Get http://localhost:3000/bl_mst/deleteBl?
   * blNo={blNo}
   */
  @ApiOperation({ title: '刪除BL的资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'deleteBl fail' })
  @Get('/deleteBl')
  async deleteBl(@Query() query) {
    let result;
    const blNo: string = query.blNo ? query.blNo : '';
    try {
      result = await this.mstService.deleteBl(blNo);
      return {
        status: result.status,
      };
    } catch (e) {
      throw new HttpException('deleteBl fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 新增MHUB_BL_MST资料，栏位不区分大小写
   * Example Post http://localhost:3000/get
   * @param hawb BL號碼
   * @param req 获取userId
   */
  @ApiOperation({ title: '新增bl_mst资料，栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `Comfirm OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  @Get('/getComfirmReslut')
  async getComfirmReslut(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const hawb: string = query.hawb ? query.hawb : '';
    try {
      const result = await this.mstService.comfirmBl(hawb, userId);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * B/L Function
   * Example Post http://localhost:3000/bl_mst/BlInqRep?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/BlInqRep')
  @ApiOperation({ title: 'B/L Function' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getBlInqRep(@Query() query, @Request() req) {
    try {
      const result = await this.mstService.getBlInqRep(query);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 發送BL提單PDF文件
   * Example Put http://localhost:3000/packlist
   * {
   *   "columns":{
   *    },
   *   "where":{
   *    }
   * }
   * @param req 获取userId
   */
  @Get('/blPdfMail')
  @ApiOperation({ title: '發送BL提單PDF文件' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async bLPdfMail(@Query() query, @Request() req) {
    const blNo: string = query.blNo ? query.blNo : '';
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result: any = await this.mstService.bLPdfMail(blNo, userId);
      return {
        status: 1,
        response: result,
      };
      // return `${result.rowsAffected} row(s) updated.`;
    } catch (e) {
      throw new HttpException('get fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * BL提單轉報關清單
   * Example Post http://localhost:3000/get
   * @param hawb BL號碼
   * @param req 获取userId
   */
  @ApiOperation({ title: 'BL提單轉報關清單' })
  @ApiResponse({
    status: 200,
    description: `Comfirm OK`,
  })
  @ApiResponse({ status: 400, description: 'Insert fail' })
  @Get('/getEdiToErpReslut')
  async getEdiToErpReslut(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const hawb: string = query.hawb ? query.hawb : '';
    try {
      const result = await this.mstService.blEdiToErp(hawb, userId);
      return {
        status: 1,
        response: result,
      };
    } catch (e) {
      throw new HttpException('Insert fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取BL报关单 信息
   * Example Post http://localhost:3000/bl_mst/ReportInf?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/ReportInf')
  @ApiOperation({ title: 'BL報關PDF文件信息' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getReportInf(@Query() query, @Request() req) {
    try {
      return await this.mstService.getReportInf(query);
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

}
