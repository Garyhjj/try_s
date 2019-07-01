import {
  isNil,
  isObject,
  isArray,
  isPlainObject,
  nextTick,
} from './../utils/index';
import { createParamDecorator } from '@nestjs/common';
import { CacheService } from '../../core/cache.service';

export const UserID = createParamDecorator((data, req) => {
  return req.user && req.user.UserID ? req.user.UserID : -1;
});

class ResultCache {
  params: any[];
  key: string;
  data: any;
  resolved?: boolean;
  cacheTime: number;
}

const cacheService = new CacheService();

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}
function oneCompare(o, n) {
  if (!isObject(n) && !isObject(o)) {
    if (o !== n) {
      return false;
    }
  } else if (isObject(n) && isObject(o)) {
    const isArrN = isArray(n),
      isArrO = isArray(o);
    if (isArrO !== isArrN) {
      return false;
    } else if (isArrN && isArrO) {
      const lgO = o.length,
        lgN = n.length;
      if (lgO !== lgN) {
        return false;
      } else {
        for (let i = 0; i < lgN; i++) {
          if (!oneCompare(o[i], n[i])) {
            return false;
          }
        }
      }
    } else {
      if (isPlainObject(n) && isPlainObject(o)) {
        const nKeys = Object.keys(n),
          oKeys = Object.keys(o);
        const lgO = oKeys.length,
          lgN = nKeys.length;
        if (lgO !== lgN) {
          return false;
        } else {
          for (let i = 0; i < lgN; i++) {
            if (!oneCompare(o[oKeys[i]], n[nKeys[i]])) {
              return false;
            }
          }
        }
      } else {
        const isS = n.toString() === o.toString();
        if (!isS) {
          return false;
        }
      }
    }
  } else {
    return false;
  }
  return true;
}
function compareParams(oldP: any[], newP: any[]) {
  return oneCompare(oldP, newP);
}

function clearCache(name, key) {
  cacheService.clear(name, key);
}
async function mapCache(name, key, cache: ResultCache) {
  const res = cache.data;
  if (res && typeof res.then === 'function') {
    let out;
    await res
      .then(c => {
        out = clone(c);
        if (!cache.resolved) {
          // console.log(`clear`, key);
          cache.resolved = true;
          const hasCacheTime = !isNil(cache.cacheTime);
          if (!hasCacheTime) {
            nextTick(() => clearCache(name, key));
          }
        }
      })
      .catch(err => {
        out = null;
        clearCache(name, key);
        return Promise.reject(err);
      });
    return out;
  } else {
    return clone(cache);
  }
}

function getCaches(name) {
  return cacheService.getAllByName(name, false);
}

function storeCache(
  name: string,
  key: string,
  val: ResultCache,
  cacheTime: number,
) {
  cacheService.update(name, key, val, cacheTime);
}
let idx = 1;
export function CacheResult(
  cacheTime?: number,
  canUserCache?: (oldP: any[], newP: any[]) => boolean,
) {
  return (target: any, key, descriptor) => {
    const name = target.constructor && target.constructor.name + '__' + key;
    const originalMethod = descriptor.value;
    const newMethod = function(...args: any[]): any {
      const caches: ResultCache[] = getCaches(name);
      if (!isNil(caches)) {
        const keys = Object.keys(caches),
          lg = keys.length;
        if (lg > 0) {
          for (let i = 0; i < lg; i++) {
            const cache = caches[keys[i]];
            const compareFn = canUserCache || compareParams;
            if (!isNil(cache) && compareFn(cache.params, args)) {
              // console.log(`get Cache ${key}`);
              return mapCache(name, key, cache);
            }
          }
        }
      }
      const result: any = originalMethod.apply(this, args),
        cacheKey = (idx++) + '',
        nCache = { data: result, params: args, cacheTime, key: cacheKey };
      storeCache(name, cacheKey, nCache, cacheTime);
      return mapCache(name, cacheKey, nCache);
    };
    descriptor.value = newMethod;
  };
}
