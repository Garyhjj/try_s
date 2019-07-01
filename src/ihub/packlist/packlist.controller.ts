import { JwtGuard } from './../../guard/jwt.guard';
import { MhubPacklistInterface } from './packlist.dto';
import { PackListService } from './packlist.service';
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

@UseGuards(JwtGuard)
@ApiUseTags('packlist')
@Controller('/packlist')
export class PacklistController {
  constructor(private packListService: PackListService) { }

  /**
   * 產生初始packlist資料
   * Example GET http://localhost:3000/packlist
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/createPacklist')
  @ApiOperation({ title: '產生初始packlist資料' })
  @ApiResponse({
    status: 200,
    description: `Create OK`,
  })
  @ApiResponse({ status: 400, description: 'Create fail' })
  async createData(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const outLotNo: string = query.outLotNo ? query.outLotNo : '';
    const inLotNo: string = query.inLotNo ? query.inLotNo : '';
    try {
      const asn = await this.packListService.createData(
        outLotNo,
        inLotNo,
        userId,
      );
      return {
        status: 1,
        response: asn,
      };
    } catch (e) {
      throw new HttpException('Create fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根據OutLot查詢packlist資料
   * Example GET http://localhost:3000/getListByLot
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/getListByLot')
  @ApiOperation({ title: '根據OutLot查詢packlist資料' })
  @ApiResponse({
    status: 200,
    description: `Select OK`,
  })
  @ApiResponse({ status: 400, description: 'Select fail' })
  async getListByLot(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const lotNo: string = query.lotNo ? query.lotNo : '';
    try {
      const res = await this.packListService.getListByLot(lotNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('Select fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根據OutLot查詢packlist資料
   * Example GET http://localhost:3000/getListByLot
   * @param body 要insert的栏位，不需要传递who clumns，自动增加
   * @param req 获取userId
   */
  @Get('/getListByLot2')
  @ApiOperation({ title: '根據OutLot查詢packlist資料' })
  @ApiResponse({
    status: 200,
    description: `Select OK`,
  })
  @ApiResponse({ status: 400, description: 'Select fail' })
  async getListByLot2(@Query() query, @Request() req) {
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    const lotNo: string = query.lotNo ? query.lotNo : '';
    try {
      const res = await this.packListService.getListByLot2(lotNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('Select fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根據OutLot查詢packlist Print資料
   * Example GET http://localhost:3000/packlist
   * @param query 查詢條件
   * @param req 获取userId
   */
  @Get('/getPackHea')
  @ApiOperation({ title: '根據OutLot查詢packlist Print資料' })
  @ApiResponse({
    status: 200,
    description: `Select OK`,
  })
  @ApiResponse({ status: 400, description: 'Select fail' })
  async getPackHea(@Query() query, @Request() req) {
    const lotNo: string = query.lotNo ? query.lotNo : '';
    try {
      const res = await this.packListService.getPackHea(lotNo);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('Select fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新packlist资料,栏位不区分大小写
   * Example POST http://localhost:3000/packlist
   * {
   *   "columns":{
   *    },
   *   "where":{
   *    }
   * }
   * @param body 传递过来要更新的栏位，如果没有LAST_UPDATED_DATE LAST_UPDATED_BY则自动增加
   * @param req 获取userId
   */
  @Post()
  @ApiOperation({ title: '更新packlist资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateMst(@Body() body: MhubPacklistInterface[], @Request() req) {
    /* if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
       throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
     }*/
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.packListService.updateMst(body, userId);
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
   * 獲取OUTBOUND REPORT FOR LOT NO NEW 信息
   * Example Post http://localhost:3000/packlist/ReportInf?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/ReportInf')
  @ApiOperation({ title: '報關PDF文件' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getReportInf(@Query() query, @Request() req) {
    try {
      // const res: any = await this.reportService.getHubInvRep(query);
      // return {
      //   status: 1,
      //   response: res.rows,
      // };
      return await this.packListService.getReportInf(query);
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取OUTBOUND PK IV 数量，重量不等的资料
   * Example Post http://localhost:8084/packlist/pkcheck
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/pkcheck')
  @ApiOperation({ title: '獲取OUTBOUND PK IV 数量，重量不等的资料' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getPkCheck(@Query() query, @Request() req) {
    try {
      const r: any = await this.packListService.getPkCheck();
      return r.rows;
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
