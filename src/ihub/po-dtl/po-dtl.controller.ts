import { JwtGuard } from './../../guard/jwt.guard';
import {
  Controller,
  Get,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PoDtlService } from './po-dtl.service';

@UseGuards(JwtGuard)
@ApiUseTags('po_dtl')
@Controller('/po_dtl')
export class PoDtlController {
  constructor(private poDtlService: PoDtlService) {}

  /**
   * 獲取PO信息
   * Example Get http://localhost:3000/po_dtl/getPoStatus?po_no={po_no}&po_bu={po_bu}&po_sno={po_sno}&part_no={part_no}&
   * vendor_code={vendor_code}&request_date={request_date}
   */
  @ApiOperation({ title: '獲取PO信息' })
  @ApiResponse({
    status: 200,
    description: `[PoDtlInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getPoStatus fail' })
  @Get('/getPoStatus')
  async getPoStatus(@Query() query) {
    let result;
    try {
      result = await this.poDtlService.getPoStatus(
        query.po_no,
        query.po_bu,
        query.po_sno,
        query.part_no,
        query.vendor_code,
        query.request_date,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException('getPoStatus fail ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
