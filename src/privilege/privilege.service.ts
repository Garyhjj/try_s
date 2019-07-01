
import { Injectable } from '@nestjs/common';
import { Database } from '../class/mioadatabase.class';

@Injectable()
export class PrivilegeService {
  db: Database;
  constructor() {
    this.db = new Database();
  }

  async getPrivilege(userId: number) {
    return await this.db.execute(
      `      SELECT DISTINCT FC.ID FUNCTION_ID,
          FC.FUNCTION_NAME,
          FC.FUNCTION_URL,
          RM.ROLE_ID,
          MR.ROLE_NAME
    FROM MOA_GL_FUNCTIONS     FC,
    MOA_GL_ROLE_FUNCTION RM,
    MOA_GL_USER_ROLE     UR,
    MOA_GL_ROLES         MR,
    MOA_GL_USERS         USR
    WHERE FC.ID = RM.FUNCTION_ID
    AND RM.ROLE_ID = UR.ROLE_ID
    AND UR.USER_ID = USR.ID
    and MR.ID = RM.ROLE_ID
    AND FC.ENABLED = 'Y'
    --  AND   FC.MOBILE_FLAG ='N'
    AND RM.ENABLED = 'Y'
    AND UR.ENABLED = 'Y'
    AND USR.ID = ${userId}
    AND EXISTS (SELECT 1
    FROM MOA_GL_FUNCTIONS MF
    WHERE FUNCTION_NAME = 'MIL'
    AND MF.ID = FC.PARENT_ID)`,
    );
  }

}
