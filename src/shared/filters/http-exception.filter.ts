import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    if (typeof exception === 'object') {
      if (exception.status) {
        response
          .status(exception.status)
          .end(request.url + '  ' + exception.message.error);
      } else {
        response
          .status(HttpStatus.BAD_REQUEST)
          .end(
            request.url +
              '  ' +
              (exception.message || JSON.stringify(exception)),
          );
      }
    } else {
      response
        .status(HttpStatus.BAD_REQUEST)
        .end(request.url + '  ' + exception);
    }
  }
}
