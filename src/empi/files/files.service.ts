import { EmpiLookupObject } from './../lookup/empi-lookup.dto';
import { EmailService } from './../../shared/services/email.service';
import { EmpiFilesObject, EmpiFilesEntity } from './empi-files.dto';
import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { Injectable } from '@nestjs/common';
import { toStoreString } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';
import { EmpiFileRelationObject } from '../file-relation/empi-file-relation.dto';
import { RenderService } from 'shared/services/render.service';
import { resolve } from 'path';
import * as moment from 'moment';
import { sortUtils, arrayClassifyByOne } from '../../shared/utils';
import * as schedule from 'node-schedule';

@Injectable()
export class FilesService {
  db: DatabaseTable;
  constructor(
    private databaseService: DatabaseService,
    private renderService: RenderService,
    private emailService: EmailService,
  ) {
    this.db = this.databaseService.getTableInstance(
      EmpiFilesObject,
      EmpiFilesEntity,
    );

    this.doSchedule();
  }

  async doSchedule() {
    schedule.scheduleJob('0 8 * * *', () => this.checkFileEffective());
  }
  async getFiles(query) {
    let { type, mn, status, category } = query;
    const { part, model, line, position, name, family } = query;
    const { signer } = query;
    type = toStoreString(type);
    mn = toStoreString(mn);
    category = toStoreString(category);
    const nameS = toStoreString(name);
    const toFilterUnApprove = status === 'F';
    status = '';
    status = toStoreString(status);
    const hasRelationSearch = part || model || line || position || family;
    let more = '';
    if (hasRelationSearch) {
      const relation = {
        PART_NO: part,
        MODEL: model,
        LINE: line,
        OPERATION_CODE: position,
        FAMILY_NAME: family,
      };
      for (const prop in relation) {
        if (relation[prop]) {
          const value = relation[prop];
          const s = `${prop} = ${toStoreString(value)}`;
          more += more ? `or ${s}` : s;
        }
      }
    }

    const hasSigner = !!signer;
    const sql = `select a.*,
    (select empno from moa_gl_users where id = a.upload_by) upload_by_empno,
(select empno from moa_gl_users where id = a.APPROVER1) APPROVER1_empno,
(select empno from moa_gl_users where id = a.APPROVER2) APPROVER2_empno from ${
      EmpiFilesObject.tableName
    } a where (${type} is null or file_type = ${type})
    and (${mn} is null or MN_NO = ${mn})
    and (${category} is null or FILE_CATEGORY = ${category})
    and (${nameS} is null or FILE_NAME like '%${name}%')
    and (${status} is null or ${
      toFilterUnApprove ? `APPROVE_FLAG <> Y` : `APPROVE_FLAG = ${status}`
    })
    ${
      hasSigner
        ? `and (a.APPROVER1 = ${signer} or a.APPROVER2 = ${signer})`
        : ''
    }
    ${
      hasRelationSearch
        ? `and exists (select 1 from ${
            EmpiFileRelationObject.tableName
          } where (${more})
    and file_id = a.id)`
        : ''
    }`;
    const [files, relations] = await Promise.all([
      this.db.search(sql),
      this.db.search(`select * from ${EmpiFileRelationObject.tableName}`),
    ]);
    files.forEach(f => {
      const { ID } = f;
      const rn = relations.filter(_ => _.FILE_ID === ID);
      const PART_NO = [],
        MODEL = [],
        LINE = [],
        OPERATION_CODE = [],
        FAMILY_NAME = [];
      rn.forEach(r => {
        PART_NO.push(r.PART_NO);
        MODEL.push(r.MODEL);
        LINE.push(r.LINE);
        OPERATION_CODE.push(r.OPERATION_CODE);
        FAMILY_NAME.push(r.FAMILY_NAME);
      });
      const filterSame = (ls: any[]) =>
        Array.from(new Set(ls))
          .filter(_ => _)
          .sort((a, b) => sortUtils.byCharCode(a, b));
      f.PART_NO = filterSame(PART_NO);
      f.MODEL = filterSame(MODEL);
      f.LINE = filterSame(LINE);
      f.OPERATION_CODE = filterSame(OPERATION_CODE);
      f.FAMILY_NAME = filterSame(FAMILY_NAME);
    });
    return files;
  }

  async getBossID(id, company) {
    const res = await this.getBoss(id, company);
    if (res) {
      return res.BOSS_ID;
    }
  }

  async getBoss(id, company) {
    const empnos = await this.databaseService.search(
      `select empno from moa_gl_users where id = ${id}`,
    );
    if (empnos.length > 0) {
      const empno = empnos[0].EMPNO;
      const selfSetDB = await this.databaseService
        .search(`select VALUE as boss, (select id from moa_gl_users where empno = value)
      boss_ID from ${
        EmpiLookupObject.tableName
      } where type='BOSS' and CODE = '${empno}'`);
      if (selfSetDB.length > 0) {
        return selfSetDB[0];
      }
      const bosses = await this.databaseService
        .search(`select boss, (select id from moa_gl_users where empno = boss)
       boss_ID from (SELECT DISTINCT boss
        FROM (  SELECT c.boss,
                       e.name,
                       c.deptno,
                       c.short_name,
                       c.grade
                  FROM guid_ps_department c,
                       (    SELECT parent, child
                              FROM guid_ps_organization
                             WHERE site = '${company}'
                        START WITH child =
                                      (SELECT a.deptno
                                         FROM guid_ps_department a,
                                              guid_employee b
                                        WHERE     a.deptno = b.deptno
                                              AND b.empno = '${empno}'
                                              AND a.site = '${company}'
                                              AND b.onboard = 'Y'
                                              AND b.disabled = 'N')
                        CONNECT BY NOCYCLE PRIOR parent = child) d,
                       guid_employee e
                 WHERE     c.deptno = d.child
                       AND c.grade <= 7
                       AND c.grade >= 3
                       AND e.empno = c.boss
                       AND e.empno <> '${empno}'
                       -- AND e.onboard = 'Y'
                       AND e.disabled = 'N'
                       AND e.company_id = '${company}'
              ORDER BY c.grade DESC)
       WHERE ROWNUM = 1)`);
      if (bosses.length > 0) {
        return bosses[0];
      }
    }
    return null;
  }

  getFilesByIDs(ids: number[]) {
    ids = ids.filter(_ => _);
    if (ids.length === 0) {
      return [];
    }
    return this.db.search(`select a.*,
    (select empno from moa_gl_users where id = a.upload_by) upload_by_empno,
    (select nick_name from moa_gl_users where id = a.upload_by) upload_by_name,
(select empno from moa_gl_users where id = a.APPROVER1) APPROVER1_empno,
(select empno from moa_gl_users where id = a.APPROVER2) APPROVER2_empno from ${
      EmpiFilesObject.tableName
    } a where id in (${ids.join(',')})`);
  }

  private needToInformBossIds = [];

  addInformBoss(id: number) {
    this.needToInformBossIds.push(id);
  }
  async updateFiles(body, userID): Promise<number> {
    let needToInformSignDone;
    const {
      FILE_NAME,
      FILE_PATH: nFILE_PATH,
      ID,
      COMPANY_CODE,
      FILE_CATEGORY,
      APPROVE_FLAG: nAPPROVE_FLAG,
    } = body;
    const group = body.MAIL_GROUP;
    if (group && Array.isArray(group)) {
      body.MAIL_GROUP = group.join(';');
    }
    if (ID > 0) {
      if (body.APPROVER2) {
        const records = await this.db.search(
          `select * from ${EmpiFilesObject.tableName} where ID = ${ID}`,
        );
        const record = records[0];
        if ((record.APPROVER2 || body.APPROVER2) && !record.APPROVE_DATE1 && body.APPROVE_DATE1) {
          this.addInformBoss(ID);
        }
        if (nAPPROVE_FLAG === 'Y' && record.APPROVE_FLAG !== 'Y') {
          needToInformSignDone = true;
        }
      }
      await this.db.update(
        {
          columns: body,
          where: {
            ID,
          },
        },
        userID,
      );
      if (needToInformSignDone) {
        this.sendSignDoneMail(ID);
      }
      return ID;
    }
    const records = await this.db.search(
      `select * from ${
        EmpiFilesObject.tableName
      } where FILE_NAME = ${toStoreString(FILE_NAME)}`,
    );
    let needCallBoss;
    const others: any = {
      APPROVE_DATE1: '',
      APPROVE_DATE2: '',
      UPLOAD_BY: userID,
      UPLOAD_TIME: new Date(),
    };
    if (+FILE_CATEGORY === 1) {
      others.APPROVE_FLAG = 'N';
      const boss = await this.getBossID(userID, COMPANY_CODE);
      others.APPROVER1 = boss;
      needCallBoss = true;
    } else {
      others.APPROVE_FLAG = 'Y';
    }
    let id;
    if (records.length > 0) {
      const rec = records[0];
      const newRec = { ...rec, ...body, ...others };
      const { FILE_PATH, APPROVE_FLAG } = rec;
      if (nFILE_PATH !== FILE_PATH) {
        newRec.UPLOAD_BY = userID;
        newRec.UPLOAD_TIME = new Date();
      }
      if (nAPPROVE_FLAG === 'Y' && APPROVE_FLAG !== 'Y') {
        needToInformSignDone = true;
      }
      await this.db.update(
        {
          columns: newRec,
          where: {
            ID: rec.ID,
          },
        },
        userID,
      );
      if (needToInformSignDone) {
        this.sendSignDoneMail(rec.ID);
      }
      id = rec.ID;
    } else {
      id = await this.db.insert({ ...body, ...others }, userID);
    }
    if (needCallBoss) {
      this.addInformBoss(id);
    }
    return id;
  }

  async sendSignDoneMail(fileID) {
    if (fileID) {
      let files = await this.getFilesByIDs([+fileID]);
      files = await this.alterFilesbeforeMail(files);
      const file = files[0];
      if (!file) {
        return;
      }
      const userDB = await this.db.search(
          `select * from moa_gl_users where id = ${+file.UPLOAD_BY}`,
        ),
        user = userDB[0];
      const title = 'e-MPI签核通过邮件提醒',
        mails = [file.MAIL_GROUP, user.EMAIL].filter(_ => _),
        cc = 'gary.h@mic.com.tw';
      // console.log(user.EMAIL, file.MAIL_GROUP);
      return await this.renderService
        .render(resolve(__dirname, '../../../views/file-sign-done.ejs'), {
          title,
          file,
        })
        .then(html => {
          // tslint:disable-next-line:no-console
          // console.log('邮件内容渲染后');
          this.emailService.sendMail({
            from: 'EMPI_System@mic.com.tw', // 发件地址
            to: mails.join(';'), // 收件列表
            // to: 'gary.h@mic.com.tw',
            subject: title, // 标题
            html,
            cc,
          });
        });
    }
  }

  async sendRejectMail(fileID, rejecterID) {
    if (fileID && rejecterID) {
      let files = await this.getFilesByIDs([+fileID]);
      files = await this.alterFilesbeforeMail(files);
      const file = files[0];
      if (!file) {
        return;
      }
      const toID = file.APPROVE_FLAG === 'N' ? file.UPLOAD_BY : file.APPROVER1;
      const [rejecterDB, toDB] = await Promise.all([
        this.db.search(`select * from moa_gl_users where id = ${+rejecterID}`),
        this.db.search(`select * from moa_gl_users where id = ${+toID}`),
      ]);
      const rejecter = rejecterDB[0],
        user = toDB[0];
      if (rejecter && user) {
        const title = 'e-MPI拒签邮件提醒',
          mails = [user.EMAIL],
          cc = 'gary.h@mic.com.tw';
        return await this.renderService
          .render(resolve(__dirname, '../../../views/file-rejected.ejs'), {
            title,
            file,
            user,
            rejecter,
          })
          .then(html => {
            // tslint:disable-next-line:no-console
            // console.log('邮件内容渲染后');
            this.emailService.sendMail({
              from: 'EMPI_System@mic.com.tw', // 发件地址
              to: mails.join(';'), // 收件列表
              // to: 'gary.h@mic.com.tw',
              subject: title, // 标题
              html,
              cc,
            });
          });
      }
    }
  }

  async sendMailtoBoss() {
    const ids = this.needToInformBossIds.slice();
    this.needToInformBossIds.length = 0;
    if (ids && ids.length > 0) {
      let files = await this.getFilesByIDs(ids);
      files = await this.alterFilesbeforeMail(files);
      files = files
        .map(f => {
          f.boss = f.APPROVE_FLAG === 'N' ? f.APPROVER1 : f.APPROVER2;
          return f;
        })
        .filter(f => f.boss);
      const ob = arrayClassifyByOne(files, 'boss');
      for (const prop in ob) {
        if (ob[prop]) {
          const bossDb = await this.db.search(
            `select * from moa_gl_users where id = ${+prop}`,
          );
          const boss = bossDb[0];
          const title = 'e-MPI待签核邮件提醒',
            cc = 'gary.h@mic.com.tw;jinzhi.he@mic.com.tw',
            mails = [boss.EMAIL];
          await this.renderService
            .render(resolve(__dirname, '../../../views/mail-for-sign.ejs'), {
              title,
              list: files,
              boss,
            })
            .then(html => {
              // tslint:disable-next-line:no-console
              // console.log('邮件内容渲染后');
              this.emailService.sendMail({
                from: 'EMPI_System@mic.com.tw', // 发件地址
                to: mails.join(';'), // 收件列表
                // to: 'gary.h@mic.com.tw',
                subject: title, // 标题
                html,
                cc,
              });
            });
        }
      }
    }
    return { status: 'ok' };
  }

  async sendMail(ids: number[], mails: string[]) {
    if (ids && ids.length > 0 && mails && mails.length > 0) {
      const files = await this.getFilesByIDs(ids);
      // console.log(files.length)
      return this.sendInformMail(mails, files);
    }
  }

  async sendInformMail(mails: string[], files: any[]) {
    files = await this.alterFilesbeforeMail(files);
    const title = 'e-MPI 文件上傳通知',
      cc = 'gary.h@mic.com.tw';
    // console.log(files.length)
    await this.renderService
      .render(resolve(__dirname, '../../../views/mail-after-upload.ejs'), {
        title,
        list: files,
      })
      .then(html => {
        // tslint:disable-next-line:no-console
        // console.log('邮件内容渲染后');
        this.emailService.sendMail({
          from: 'EMPI_System@mic.com.tw', // 发件地址
          to: mails.join(';'), // 收件列表
          // to: 'gary.h@mic.com.tw;jinzhi.he@mic.com.tw',
          subject: title, // 标题
          html,
          cc,
        });
      });
    return { status: 'ok' };
  }

  async alterFilesbeforeMail(files) {
    const types = await this.db.search(`select * from ${
      EmpiLookupObject.tableName
    }
    where type = 'FILE_TYPE'`);
    const typeOb = {};
    types.forEach(t => {
      typeOb[t.CODE] = t.VALUE;
    });
    const ids = files.map(_ => _.ID);
    const relations = await this.databaseService.search(
      `select * from ${
        EmpiFileRelationObject.tableName
      } where file_id in (${ids.join(',')})`,
    );
    files.forEach(f => {
      f.FILE_TYPE = typeOb[f.FILE_TYPE];
      f.UPLOAD_TIME = moment(f.UPLOAD_TIME).format('YYYY-MM-DD HH:mm');
      f.FILE_CATEGORY = +f.FILE_CATEGORY === 1 ? '试产文件' : '正式文件';
      f.parts = relations.filter(r => r.FILE_ID === f.ID).map(_ => _.PART_NO);
    });
    return files;
  }

  async checkFileEffective() {
    const files = await this.db.search(`select * from ${
      EmpiFilesObject.tableName
    }
    where FILE_CATEGORY = '1' and APPROVE_FLAG = 'Y'
    and APPROVE_DATE2 + 37< sysdate`);
    return await Promise.all(
      files.map(async f => {
        const { APPROVE_DATE2: aDate } = f,
          nowT = Date.now(),
          efftiveT = new Date(aDate).getTime(),
          during = nowT - efftiveT,
          oneDay = 1000 * 60 * 60 * 24,
          getDays = n => oneDay * n;
        if (during > getDays(37) && during <= getDays(42)) {
          return this.sendEffectiveMail(1, f);
        } else if (during > getDays(42) && during <= getDays(45)) {
          return this.sendEffectiveMail(1, f);
        } else if (during > getDays(45)) {
          await this.db.update(
            {
              columns: { ID: f.ID, ENABLED: 'N' },
              where: {
                ID: f.ID,
              },
            },
            -1,
          );
          return this.sendEffectiveMail(3, f);
        }
      }),
    );
  }

  async sendEffectiveMail(type, f) {
    const files = await this.alterFilesbeforeMail([f]);
    const file = files[0];
    const userDB = await this.db.search(
        `select * from moa_gl_users where id = ${+file.UPLOAD_BY}`,
      ),
      user = userDB[0];
    const title =
        type !== 3 ? 'e-MPI文件即将超时邮件提醒' : 'e-MPI文件作废邮件提醒',
      mails = [file.MAIL_GROUP, user.EMAIL].filter(_ => _),
      cc = 'gary.h@mic.com.tw';
    let subContent;
    switch (type) {
      case 1:
        subContent = '以下臨時文件即將超期，請及時更新!';
        break;
      case 2:
        subContent = '以下臨時文件即將超期并在三天內刪除，請及時更新!';
        break;
      case 3:
        subContent = '以下臨時文件已作废。';
        break;
      default:
        break;
    }
    return await this.renderService
      .render(resolve(__dirname, '../../../views/file-effective.ejs'), {
        title,
        file,
        subContent,
      })
      .then(html => {
        // tslint:disable-next-line:no-console
        // console.log('邮件内容渲染后');
        this.emailService.sendMail({
          from: 'EMPI_System@mic.com.tw', // 发件地址
          to: mails.join(';'), // 收件列表
          // to: 'gary.h@mic.com.tw',
          subject: title, // 标题
          html,
          cc,
        });
      });
  }
}
