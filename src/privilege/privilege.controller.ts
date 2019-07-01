
import {
  Controller,
  Get,
  UseGuards,
  Query,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from '../guard/jwt.guard';
import { PrivilegeService } from './privilege.service';

@UseGuards(JwtGuard)
@ApiUseTags('privilege')
@Controller('/privilege')
export class PrivilegeController {
  constructor(private privilegeService: PrivilegeService) { }

  /**
   * 获得IHUB權限
   * Example Get http://localhost:3000/privilege?userId=2
   */
  @ApiOperation({ title: '获得IHUB權限' })
  @ApiResponse({
    status: 200,
    description: `[getPrivilege]`,
  })
  @ApiResponse({ status: 400, description: 'getPrivilege fail' })
  @Get()
  async getPrivilege(@Query() query, @Request() req) {
    let result;
    const userId = query.userId ? query.userId : req.user.UserID;
    try {
      result = await this.privilegeService.getPrivilege(userId);
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getPrivilege fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
