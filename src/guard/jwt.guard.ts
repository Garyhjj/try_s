import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as moment from 'moment';
import * as crypto from 'crypto';

const key = 'MiTAC@!QAZ2wsx';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.access_token || '';
    return true;
    // let result: boolean = false;
    if (token) {
      const [header, content, sign] = token.split('.');

      let user;
      try {
        user = JSON.parse(Buffer.from(content, 'base64').toString());
        request.user = user;
        // console.log(user);
      } catch (e) {
        return false;
      }

      if (
        crypto
          .createHmac('sha256', header + '.' + content)
          .update(key)
          .digest('base64') !== sign
      ) {
        return false;
      }

      if (new Date().getTime() - new Date(user.Exp).getTime() > 0) {
        return false;
      }

      return true;
    }
    return false;
  }
}
