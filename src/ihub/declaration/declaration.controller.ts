import { JwtGuard } from './../../guard/jwt.guard';
import { DeclarationService } from './declaration.service';
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
import { UserID } from '../../shared/decorators';
import { isArray } from 'util';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtGuard)
@ApiUseTags('declarations')
@Controller('/declarations')
@Controller()
export class DeclarationController {
  constructor(private declarationService: DeclarationService) {}

  @ApiOperation({ title: '获得報關狀況的资料' })
  @ApiResponse({
    status: 200,
    description: `[CustomList]`,
  })
  @Get()
  async getDeclarations(@Query() query) {
    return await this.declarationService.getDeclarations(query);
  }

  @ApiOperation({ title: '获得可維護報關狀況的asn资料' })
  @ApiResponse({
    status: 200,
  })
  @Get('asn')
  async getAsnForDeclarations(@Query() query) {
    return await this.declarationService.getAsnForDeclarations(query);
  }

  @ApiOperation({ title: '更新及插入報關狀況的资料' })
  @ApiResponse({
    status: 200,
    description: `ID`,
  })
  @Post()
  async updateDeclaration(@Body() body, @UserID() userID) {
    if (isArray(body)) {
      return Promise.all(
        body.map(b => this.declarationService.updateDeclaration(b, userID)),
      );
    } else {
      return await this.declarationService.updateDeclaration(body, userID);
    }
  }

  @ApiOperation({ title: '更新及插入入倉资料' })
  @ApiResponse({
    status: 200,
    description: `ID`,
  })
  @Post('warehouses/dates')
  async updateWarehouseDate(@Body() body, @UserID() userID) {
    if (isArray(body)) {
      return Promise.all(
        body.map(b => this.declarationService.updateWarehouseDate(b, userID)),
      );
    } else {
      return await this.declarationService.updateWarehouseDate(body, userID);
    }
  }

  @ApiOperation({ title: '獲得入倉资料' })
  @ApiResponse({
    status: 200,
    description: `[ReceivedWhDate]`,
  })
  @Get('warehouses/dates')
  async getWarehouseDate(@Query() query) {
    return await this.declarationService.getWarehouseDate(query);
  }

  @ApiOperation({ title: '获得可維護入倉资料的asn资料' })
  @ApiResponse({
    status: 200,
  })
  @Get('warehouses/asn')
  async getAsnForWarehouseDate(@Query() query) {
    return await this.declarationService.getAsnForWarehouseDate(query);
  }

  @ApiOperation({ title: '获得可維護入倉资料的異常的资料' })
  @ApiResponse({
    status: 200,
  })
  @Get('warehouses/errors')
  async getWarehouseDateWithError(@Query() query) {
    // tslint:disable-next-line:no-console
    console.log(`getWarehouseDateWithError start at ${new Date()}`);
    const res = await this.declarationService.getWarehouseDateWithError(query);
    // tslint:disable-next-line:no-console
    console.log(`getWarehouseDateWithError end at ${new Date()}`);
    return res;
  }

  @ApiOperation({ title: '更新及插入入倉资料的異常的资料' })
  @ApiResponse({
    status: 200,
    description: `[CloseErrorRemark]`,
  })
  @Post('warehouses/errors')
  async updateWarehouseDateWithError(@Body() body, @UserID() userID) {
    if (isArray(body)) {
      return Promise.all(
        body.map(b =>
          this.declarationService.updateWarehouseDateWithError(b, userID),
        ),
      );
    } else {
      return await this.declarationService.updateWarehouseDateWithError(
        body,
        userID,
      );
    }
  }

  @ApiOperation({ title: '獲得詳細的報告狀況' })
  @ApiResponse({
    status: 200,
  })
  @Get('details')
  async getDeclarationDetail(@Query() query) {
    return await this.declarationService.getDeclarationDetail(query);
  }

  @ApiOperation({ title: '報表，報告狀況查詢' })
  @ApiResponse({
    status: 200,
  })
  @Get('situation')
  async getDeclarationsBeforeOrAfter(@Query() query) {
    return await this.declarationService.getDeclarationsBeforeOrAfter(query);
  }

  @ApiOperation({ title: '報表，每天進口達成率查詢' })
  @ApiResponse({
    status: 200,
  })
  @Get('rate')
  async getDeclarationForRate(@Query() query) {
    return await this.declarationService.getDeclarationForRate(query);
  }

  @ApiOperation({ title: '報表，未報關報急提單查詢' })
  @ApiResponse({
    status: 200,
  })
  @Get('urgencies')
  async getUnFisishAndUrgentDeclarations() {
    return await this.declarationService.getUnFisishAndUrgentDeclarations();
  }

  @ApiOperation({ title: '報表，商檢報表' })
  @ApiResponse({
    status: 200,
  })
  @Get('inspections')
  async getInspectionDeclarations(@Query() query) {
    // tslint:disable-next-line:no-console
    console.log(`getInspectionDeclarations start at ${new Date()}`);
    const res = await this.declarationService.getInspectionDeclarations(query);
    // tslint:disable-next-line:no-console
    console.log(`getWarehouseDateWithError end at ${new Date()}`);
    return res;
  }

  @ApiOperation({ title: '修改商檢信息' })
  @ApiResponse({
    status: 200,
  })
  @Post('inspections')
  async changeInspectionDeclarations(@Body() body, @UserID() userID) {
    return await this.declarationService.changeInspectionDeclarations(
      body,
      userID,
    );
  }

  @ApiOperation({ title: '許可證查詢報表' })
  @ApiResponse({
    status: 200,
  })
  @Get('Permits')
  async getPermitDeclarations(@Query() query) {
    return await this.declarationService.getPermitDeclarations(query);
  }

  @ApiOperation({ title: '進口提單報表' })
  @ApiResponse({
    status: 200,
  })
  @Get('imports')
  async getImportDeclarations(@Query() query) {
    if (query.type === '2') {
      return await this.declarationService.getImportDeclarations2(query);
    } else {
      return await this.declarationService.getImportDeclarations(query);
    }
  }

  @Get('items/maintainence')
  async getItemForMaintainence(@Query() query) {
    return await this.declarationService.getItemForMaintainence(query);
  }
}
