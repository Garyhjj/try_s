import { CombineSoMstService } from './combine-so-mst.service';
import { JwtGuard } from '../../guard/jwt.guard';
import {
  Controller,
  Get,
  Body,
  Put,
  Delete,
  Request,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateObject } from '../../class/update-object.class';
import { DeleteObject } from '../../class/delete-object.class';

@UseGuards(JwtGuard)
@ApiUseTags('combine_so_mst')
@Controller('/combine_so_mst')
export class CombineSoMstController {
  constructor(private mstService: CombineSoMstService) { }

  /**
   * 获取所有combine_so_mst的资料
   * Example Get http://localhost:3000/combine_so_mst/getCombineList?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '获得combine资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllDataDrive fail' })
  @Get('/getCombineInf')
  async getWaitCombineInf(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.getWaitCombineInf(
        onBoardDate,
        containerNo,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getCombineList fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 获取所有combine_so_mst的资料
   * Example Get http://localhost:3000/combine_so_mst/getCombineList?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '获得combine资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getAllDataDrive fail' })
  @Get('/getCombineList')
  async getWaitCombineList(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.getWaitCombineList(
        onBoardDate,
        containerNo,
      );
      return {
        status: 1,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getCombineList fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 产生等待combine的资料
   * Example Get http://localhost:3000/combine_so_mst/getCombineList?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '获得combine资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'generateCombineData fail' })
  @Get('/generateCombineData')
  async generateCombineData(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.generateCombineData(
        onBoardDate,
        containerNo,
      );
      return {
        status: 1,
      };
    } catch (e) {
      throw new HttpException(
        'generateCombineData fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 自动combine的资料
   * Example Get http://localhost:3000/combine_so_mst/autoCombineData?
   * onBoardDate={onBoardDate}&containerNo={containerNo}&soWholeorPartial={soWholeorPartial}
   */
  @ApiOperation({ title: '自动combine资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'autoCombineData fail' })
  @Get('/autoCombineData')
  async autoCombineData(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    const soWholeorPartial: string = query.soWholeorPartial
      ? query.soWholeorPartial
      : '';
    try {
      result = await this.mstService.autoCombineData(
        onBoardDate,
        containerNo,
        soWholeorPartial,
      );
      return {
        status: 1,
      };
    } catch (e) {
      throw new HttpException(
        'autoCombineData fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 手动combine的资料
   * Example Get http://localhost:3000/combine_so_mst/singleCombineData?
   * onBoardDate={onBoardDate}&containerNo={containerNo}&soList={soList}&soWholeorPartial={soWholeorPartial}
   */
  @ApiOperation({ title: '手动combine资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'singleCombineData fail' })
  @Get('/singleCombineData')
  async singleCombineData(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    const soList: string = query.soList ? query.soList : '';
    const soWholeorPartial: string = query.soWholeorPartial
      ? query.soWholeorPartial
      : '';
    try {
      result = await this.mstService.singleCombineData(
        onBoardDate,
        containerNo,
        soList,
        soWholeorPartial,
      );
      return {
        status: result.status,
      };
    } catch (e) {
      throw new HttpException(
        'singleCombineData fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 根据container_no获取MHUB_COMBINE_SO_MST的资料
   * Example Get http://localhost:3000/combine_so_mst/getMstByContainerNo?onBoardDate={onBoardDate}&containerNo={containerNo}
   */
  @ApiOperation({ title: '根据container_no获取MHUB_COMBINE_SO_MST的资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'getMstByContainerNo fail' })
  @Get('/getMstByContainerNo')
  async getMstByContainerNo(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    try {
      result = await this.mstService.getMstByContainerNo(
        onBoardDate,
        containerNo,
      );
      return {
        status: result.status,
        response: result.rows,
      };
    } catch (e) {
      throw new HttpException(
        'getMstByContainerNo fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 手动combine的资料
   * Example Get http://localhost:3000/combine_so_mst/singleCombineData?
   * onBoardDate={onBoardDate}&containerNo={containerNo}&soList={soList}&soWholeorPartial={soWholeorPartial}
   */
  @ApiOperation({ title: '删除COMBINE资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'deleteMstByCombineNo fail' })
  @Get('/deleteMstByCombineNo')
  async deleteMstByCombineNo(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    const combineNo: string = query.combineNo ? query.combineNo : '';
    try {
      result = await this.mstService.deleteMstByCombineNo(
        onBoardDate,
        containerNo,
        combineNo,
      );
      return {
        status: result.status,
      };
    } catch (e) {
      throw new HttpException(
        'deleteMstByCombineNo fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Finish combine的资料
   * Example Get http://localhost:3000/combine_so_mst/singleCombineData?
   * onBoardDate={onBoardDate}&containerNo={containerNo}&soList={soList}&soWholeorPartial={soWholeorPartial}
   */
  @ApiOperation({ title: 'FINISH COMBINE资料' })
  @ApiResponse({
    status: 200,
    description: `[CombineSoMstInterface]`,
  })
  @ApiResponse({ status: 400, description: 'finishCombine fail' })
  @Get('/finishCombine')
  async finishCombine(@Query() query) {
    let result;
    const onBoardDate: string = query.onBoardDate ? query.onBoardDate : '';
    const containerNo: string = query.containerNo ? query.containerNo : '';
    const combineNo: string = query.combineNo ? query.combineNo : '';
    try {
      result = await this.mstService.finishCombine(onBoardDate, containerNo);
      return {
        status: result.status,
      };
    } catch (e) {
      throw new HttpException(
        'finishCombine fail ' + e,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 更新bl_mst资料,栏位不区分大小写
   * Example Put http://localhost:3000/bl_mst
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
  @ApiOperation({ title: '更新bl_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) updated.`,
  })
  @ApiResponse({ status: 400, description: 'Update fail' })
  async updateMst(@Body() body: UpdateObject, @Request() req) {
    if (!body.hasOwnProperty('columns') || !body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user && req.user.UserID ? req.user.UserID : -1;
    try {
      const result = await this.mstService.updateMst(body, userId);
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
   * by ID 删除bl_mst资料,栏位不区分大小写
   * Example Delete http://localhost:3000/bl_mst/1
   * @param param 获取参数id
   */
  @Delete(':id')
  @ApiOperation({ title: '删除bl_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteMstById(@Param('id') id: number) {
    if (isNaN(+id)) {
      throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.mstService.deleteMstById(id);
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
   * 删除bl_mst资料,栏位不区分大小写
   * Example Delete http://localhost:3000/bl_mst
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
  @ApiOperation({ title: '删除bl_mst资料,栏位不区分大小写' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteMst(@Body() body: DeleteObject) {
    if (!body.hasOwnProperty('where')) {
      throw new HttpException('请求格式不符合要求', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.mstService.deleteMst(body);
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
   * by so_no 删除MHUB_COMBINE_SO_TEMP资料
   * Example Delete http://localhost:3000/combine_so_mst/deleteCombineTemp
   * @param param 获取参数id
   */
  @Get('/deleteCombineTemp')
  @ApiOperation({ title: '删除MHUB_COMBINE_SO_TEMP资料' })
  @ApiResponse({
    status: 200,
    description: `x row(s) deleted.`,
  })
  @ApiResponse({ status: 400, description: 'Delete fail' })
  async deleteCombineTemp(@Query() query) {
    const soNo: string = query.soNo ? query.soNo : '';
    try {
      const result = await this.mstService.deleteBySo(soNo);
      return {
        status: 1,
      };
    } catch (e) {
      throw new HttpException('Delete fail' + e, HttpStatus.BAD_REQUEST);
    }
  }

  // /**
  //  * 根据id获取bl_MST资料
  //  * Example：Get http://localhost:3000/bl_mst/24
  //  * @param param 获取参数id
  //  */
  // @Get('/:id')
  // @ApiOperation({ title: '根据id获取bl_mst资料' })
  // @ApiResponse({
  //   status: 200,
  //   description: `[
  //       {
  //         "ID": 63,
  //         "TITLE": "abc",
  //         "REF_DEPT": null,
  //         "CODE": null,
  //         "VERSION": null,
  //         "TIME": null,
  //         "PASS_SCORE": null,
  //         "CREATION_DATE": "2018-05-31T14:57:32.000Z",
  //         "CREATION_BY": -1,
  //         "LAST_UPDATED_DATE": "2018-05-31T14:57:32.000Z",
  //         "LAST_UPDATED_BY": -1,
  //         "COMPANY_ID": null,
  //         "FLAG": null
  //       }
  //     ]`,
  // })
  // @ApiResponse({ status: 400, description: 'getMstById fail' })
  // async getMstById(@Param('id') id: string) {
  //   if (isNaN(+id)) {
  //     throw new HttpException('id must be a number. ', HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     const result = await this.mstService.getMstById(+id);
  //     return {
  //       status: 1,
  //       response: result.rows,
  //     };
  //   } catch (e) {
  //     throw new HttpException('getMstById fail' + e, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
