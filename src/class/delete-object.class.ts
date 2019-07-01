import { ApiModelProperty } from '@nestjs/swagger';

export class DeleteObject {
  @ApiModelProperty() where: any;
}
