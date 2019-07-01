import { Database } from './../../class/database.class';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import {
  ControlPartEntity,
  ControlPartObject,
  ControlPartInterface,
} from './control-part.dto';

@Injectable()
export class ControlPartService {
  db: Database;
  constructor() {
    this.db = new Database(ControlPartObject, ControlPartEntity);
  }

  async getAllControlPart(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async createControlPart(body: ControlPartInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateControlPart(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteControlPartById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
