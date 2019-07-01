import { DatabaseService } from './../../core/database.service';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { promisify } from 'util';

const transporter = nodemailer.createTransport({
  host: '10.86.0.220',
  port: 25, // SMTP 端口
});
@Injectable()
export class EmailService {
  constructor(private databaseService: DatabaseService) {}

  backUpMailAfterSending({ from, to, subject, cc = '', bcc = '', content }) {
    let blocks = [];
    content = content.replace(/\'/g, '"').replace(/\r\n/g, '');
    while (content.length > 3000) {
      blocks.push(content.slice(0, 3000));
      content = content.slice(3000);
    }
    blocks.push(content);
    blocks = blocks
      .map(b => `'${b}'`)
      .map(b => `v_content := v_content || ${b};`);
    const v_contentPre = blocks.join(' ');
    return this.databaseService
      .execute(
        `
           DECLARE
            v_content   CLOB := '';
            begin
            ${v_contentPre}
            insert into moa_mail_log (mail_pending_id,
            mail_id,
            mail_from,
            mail_to,
            mail_cc,
            mail_bcc,
            subject,
            content,
            urgent_level,
            import_level,
            status,
            CREATE_BY,
            create_date,
            MAIL_DATE)
            values
            (moa_pending_mails_id.nextval,0,'${from}','${to}','${cc}','${bcc}','${subject}',v_content,1,1,1,-2,sysdate,sysdate);
            end;`,
      )
      .then(() => 'OK');
  }

  private async _sendMail(mailOptions) {
    await promisify(transporter.sendMail.bind(transporter))(mailOptions);
    const backUp = Object.assign({}, mailOptions);
    backUp.content = backUp.html || backUp.text;
    return this.backUpMailAfterSending(backUp);
  }

  async sendMail(mailOptions) {
    return this._sendMail(mailOptions).catch(err => {
      this.databaseService.execute(`
      begin
      MOA_SEND_MAIL_PKG.
      SEND_COMMON_MAIL (
        'gary.h@mic.com.tw',
        '邮件通知异常',
        '${mailOptions.subject}',
        'Mhub_Urgent@mic.com.tw',
        '');
        MOA_SEND_MAIL_PKG.SEND_MAIL;
        end;`);
      return Promise.reject(err);
    });
  }

  async dbSendMail({ from, to, subject, cc = '', bcc = '', html, text }: any) {
    let content = html || text;
    let blocks = [];
    content = content.replace(/\'/g, '"').replace(/\r\n/g, '');
    while (content.length > 3000) {
      blocks.push(content.slice(0, 3000));
      content = content.slice(3000);
    }
    blocks.push(content);
    blocks = blocks
      .map(b => `'${b}'`)
      .map(b => `v_content := v_content || ${b};`);
    const v_contentPre = blocks.join(' ');
    return this.databaseService
      .execute(
        `
           DECLARE
            v_content   CLOB := '';
            begin
            ${v_contentPre}
            MOA_SEND_MAIL_PKG.SEND_COMMON_MAIL (
              '${to}',
              '${subject}',
               v_content,
              '${from}',
              '${cc}',
              '${bcc}'
                );
              MOA_SEND_MAIL_PKG.SEND_MAIL;
            end;`,
        undefined,
        undefined,
        { switchToOA: true },
      )
      .then(() => 'OK');
  }

  async getMail(empnos): Promise<string[]> {
    if (!empnos) return;
    const empnosArr = Array.isArray(empnos) ? empnos : [empnos];
    return Promise.all(
      empnosArr.map(n => {
        return this.databaseService
          .search(
            `SELECT email FROM moa_gl_users WHERE empno = '${n}' or email = '${n}' or user_name= '${n}'`,
          )
          .then(ls => {
            return ls.length > 0 ? ls[0].EMAIL : n;
          });
      }),
    );
  }
}
