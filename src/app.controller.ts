import { UtilService } from './core/util.service';
import { HttpService } from '@nestjs/common/http';
import { Get, Post, Controller, Body, Param, FileInterceptor, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import * as process from 'child_process';

@ApiUseTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private http: HttpService,
    private utilService: UtilService,
  ) { }
  safeCommands = ['npm run update', 'pm2 reload ihubServer'];

  @ApiOperation({ title: 'Hello world' })
  @ApiResponse({
    status: 200,
    description: `Hello world`,
  })
  @Get()
  root() {
    return this.appService.root();
  }
  /**
   * 辅助API,用于产生table json Object
   * Example Get http://localhost:3000/debug/moa_exams
   * @param {*} param
   * @returns {}
   * @memberof AppController
   */
  @ApiOperation({ title: '辅助API,用于产生table json Object' })
  @ApiResponse({
    status: 200,
    description: `{
      ID: { type: 'number' },
      TITLE: { type: 'string' },
      REF_DEPT: { type: 'string' },
      CODE: { type: 'string' },
      VERSION: { type: 'string' },
      TIME: { type: 'number' },
      PASS_SCORE: { type: 'number' },
      CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
      CREATION_BY: { type: 'number' },
      LAST_UPDATED_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
      LAST_UPDATED_BY: { type: 'number' },
      COMPANY_ID: { type: 'string' },
      FLAG: { type: 'string' },
    }`,
  })
  @Get('debug/:name')
  async getTableJsonObject(@Param('name') name: string) {
    // 只是用于console.log，方便开发人员复制信息
    const tableInterface = await this.appService.getTableInterfaceString(name);
    const jsonObject = await this.appService.getTableJsonObject(name);
    return {
      tableInterface,
      jsonObject,
    };
  }

  @Post('command')
  async executeCommand(@Body() body) {
    const userName = body.userName || '';
    const password = body.password || '';
    const command = body.command || '';
    if (userName === 'ihub' && password === '154asd!WEaa1' && command) {
      const index = this.safeCommands.indexOf(command);
      if (index > -1) {
        const result = await this.exec(command);
        return result;
      } else {
        return '非法命令';
      }
    } else {
      return '非法命令';
    }
  }

  async exec(command: string) {
    return new Promise((resolve, reject) => {
      process.exec(command, (err, stdout, stderr) => {
        if (err) {
          resolve(`exec ${command} fail : ${err}`);
        } else {
          resolve(`exec ${command} success`);
        }
      });
    });
  }

  // @Post('SystemOperation/UploadFiles')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(@UploadedFile() file) {
  //   console.log(file);
  // }

  // @ApiOperation({ title: '登陆' })
  // @ApiResponse({
  //   status: 200,
  //   description: `Hello world`,
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: '{status: 0, msg: "Username or password error"}',
  // })
  // @Post('login')
  // async login(@Body() body) {
  //   let result;
  //   try {
  //     result = await this.http
  //       .post('http://miapphost01.mic.com.cn/global/login', body)
  //       .toPromise();
  //   } catch (e) {
  //     return {
  //       status: 0,
  //       msg: 'Username or password error',
  //     };
  //   }
  //   return {
  //     status: 1,
  //     response: result.data,
  //   };
  //   // {
  //   //   "userName":"/tmbQPOcQLzlAgnDDy5toA==",
  //   //   "password":"xfQqISZ0nQXSw5bH5V15Tg=="
  //   // }
  // }
}
