import { JwtGuard } from './../../guard/jwt.guard';
import { HttpExceptionFilter } from './../../shared/filters/http-exception.filter';

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UtilsService } from './utils.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('utils')
@Controller('/utils')
@Controller()
export class UtilsController {
  constructor(private utilsService: UtilsService) {}

  @Get('mcAndBuyer')
  async getMcAndBuyer(@Query() query) {
    return await this.utilsService.getMcAndBuyer(query.part_no, query.bu);
  }

  @Post('mcAndBuyers')
  async getMcAndBuyers(@Body() body) {
    return await this.utilsService.getMcAndBuyers(body);
  }
}
