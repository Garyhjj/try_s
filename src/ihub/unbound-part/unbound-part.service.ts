import { Database } from './../../class/database.class';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import {
  UnboundPartObject,
  UnboundPartEntity,
  UnboundPartInterface,
} from './unbound-part.dto';

@Injectable()
export class UnboundPartService {
  db: Database;
  constructor() {
    this.db = new Database(UnboundPartObject, UnboundPartEntity);
  }

  async getAllUnboundPart(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async createUnboundPart(body: UnboundPartInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUnboundPart(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUnboundPartById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
