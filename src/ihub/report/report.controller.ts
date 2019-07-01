import { JwtGuard } from './../../guard/jwt.guard';
import { ReportService } from './report.service';
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiUseTags('report')
@Controller('/report')
export class ReportController {
  constructor(private reportService: ReportService) { }

  /**
   * 獲取進口材料收料信息
   * Example Post http://localhost:3000/report/getIncoming?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/getIncoming')
  @ApiOperation({ title: '獲取進口材料收料信息' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getIncoming(@Query() query, @Request() req) {
    try {
      const res: any = await this.reportService.getIncoming(query);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取HUB 盤點表信息
   * Example Post http://localhost:3000/report/hubinvinfo?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/hubinvinfo')
  @ApiOperation({ title: '盤點表信息' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getHubInvInfo(@Query() query, @Request() req) {
    try {
      const res: any = await this.reportService.getHubInvInfo(query);
      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 獲取HUB 盤點報表
   * Example Post http://localhost:3000/report/hubinvrep?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/hubinvrep')
  @ApiOperation({ title: '盤點報表' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getHubInvRep(@Query() query, @Request() req) {
    try {
      // const res: any = await this.reportService.getHubInvRep(query);
      // return {
      //   status: 1,
      //   response: res.rows,
      // };
      return await this.reportService.getHubInvRep(query);
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 香港報關List報表
   * Example Post http://localhost:3000/report/hkdeclarationrep?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/hkdeclarationrep')
  @ApiOperation({ title: '香港報關List報表' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async getHkDeclarationRep(@Query() query, @Request() req) {
    try {
      return await this.reportService.getHkDeclarationRep(query);
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Exchange ESCM ASN Data Quiry
   * Example Post http://localhost:3000/report/hkdeclarationrep?
   * @param query lotNO, invNO
   * @param req 获取userId
   */
  @Get('/escmExchangeDatarep')
  @ApiOperation({ title: 'Exchange ESCM ASN Data Quiry' })
  @ApiResponse({
    status: 200,
    description: `GET OK`,
  })
  @ApiResponse({ status: 400, description: 'GET fail' })
  async escmExchangeDatarep(@Query() query, @Request() req) {
    try {
      const res = await this.reportService.escmExchangeDatarep(query);

      return {
        status: 1,
        response: res.rows,
      };
    } catch (e) {
      throw new HttpException('GET fail' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
