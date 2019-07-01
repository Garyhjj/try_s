import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Put,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Request,
  Options,
  UseGuards,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiUseTags('upload')
@Controller('upload')
export class UploadController {
  @Post()
  @ApiOperation({ title: '上传文件' })
  @ApiResponse({
    status: 200,
    description: `http://localhost:3000/assets/uploads/xxxxxx`,
  })
  async upload(@Request() req, @Body() body) {
    const file = req.files[0];
    const uploadfolderpath = path.join(__dirname, '../assets/uploads');
    fs.writeFileSync(uploadfolderpath + '/' + file.originalname, file.buffer);
    return {
      status: 1,
      // SystemConfig.API_server_type + SystemConfig.API_server_host + ':' + SystemConfig.API_server_port + '/assets/uploads/' + filename
      response: 'http://localhost:3000/assets/uploads/' + file.originalname,
    };
  }
}
