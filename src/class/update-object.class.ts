// import { IsString, IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateObject {
  @ApiModelProperty() columns?: any;
  @ApiModelProperty() where: any;
}
