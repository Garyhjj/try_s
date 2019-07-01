import * as moment from 'moment';

export function promisify(nodeFunction) {
  function promisified(...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...result) {
        if (err) return reject(err);
        if (result.length === 1) return resolve(result[0]);
        return resolve(result);
      }
      nodeFunction.call(null, ...args, callback);
    });
  }
  return promisified;
}

const wait = after => {
  return new Promise((r, j) => {
    setTimeout(() => {
      try {
        r('ok');
      } catch (e) {
        j(e);
      }
    }, after);
  });
};
const PromiseFlow = {
  list: [],
  startFlow: async () => {
    const list = PromiseFlow.list;
    if (list.length > 0) {
      const first = list.shift();
      const res = await first.fn();
      await first.resolve(res);
      await wait(500);
      PromiseFlow.startFlow();
    }
  },
};

const push = Array.prototype.push;
PromiseFlow.list.push = function(n) {
  const lg = PromiseFlow.list.length;
  if (lg === 0) {
    setTimeout(() => {
      PromiseFlow.startFlow();
    }, 200);
  }
  return push.call(this, n);
};
export function promiseFlow(fn) {
  if (typeof fn === 'function') {
    return new Promise((resolve, reject) => {
      PromiseFlow.list.push({
        resolve,
        reject,
        fn,
      });
    });
  } else {
    return Promise.reject('no fn');
  }
}

export const isNumber = num => {
  return !Number.isNaN(Number(num));
};
export const isArray = ar => {
  return Object.prototype.toString.call(ar) === '[object Array]';
};

export function isNative(Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

const _toString = Object.prototype.toString;

export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === '[object Object]';
}

export const sortUtils = {
  byCharCode: (a: any, b: any, isAscend = true) => {
    a = a + '';
    b = b + '';
    const res = a > b ? 1 : a === b ? 0 : -1;
    return isAscend ? res : -res;
  },
  byDate: (a: string, b: string, isAscend = true, format?: string) => {
    const toDateA = moment(a, format);
    const toDateB = moment(b, format);
    const isValida = toDateA.isValid(),
      isValidb = toDateB.isValid();
    let res;
    if (!isValida && !isValidb) {
      return sortUtils.byCharCode(a, b, isAscend);
    } else if (isValida && !isValidb) {
      res = 1;
    } else if (!isValida && isValidb) {
      res = -1;
    } else {
      res = toDateA.toDate().getTime() - toDateB.toDate().getTime();
    }
    return isAscend ? res : -res;
  },
  byTime: (
    a: string,
    b: string,
    isAscend = true,
    format: string = 'HH:mm:ss',
  ) => {
    const toDateA = moment('2018-01-01T ' + a, 'YYYY-MM-DDT ' + format);
    const toDateB = moment('2018-01-01T ' + b, 'YYYY-MM-DDT ' + format);
    const isValida = toDateA.isValid(),
      isValidb = toDateB.isValid();
    let res;
    if (!isValida && !isValidb) {
      return sortUtils.byCharCode(a, b, isAscend);
    } else if (isValida && !isValidb) {
      res = 1;
    } else if (!isValida && isValidb) {
      res = -1;
    } else {
      res = toDateA.toDate().getTime() - toDateB.toDate().getTime();
    }
    return isAscend ? res : -res;
  },
  byNumber: (a: number, b: number, isAscend = true) => {
    const isValida = isNumber(a),
      isValidb = isNumber(b);
    let res;
    if (!isValida && !isValidb) {
      return sortUtils.byCharCode(a, b, isAscend);
    } else if (isValida && !isValidb) {
      res = 1;
    } else if (!isValida && isValidb) {
      res = -1;
    } else {
      res = Number(a) - Number(b);
    }
    return isAscend ? res : -res;
  },
};

export function arrayClassifyByOne(target, prop) {
  // tslint:disable-next-line:curly
  if (!Array.isArray(target)) return null;
  const out = {};
  target.forEach(t => {
    const val = t[prop] || 'null';
    out[val] = out[val] || [];
    out[val].push(t);
  });
  return out;
}
export const isUndefined = (obj): obj is undefined =>
  typeof obj === 'undefined';
export const isNil = (obj): boolean => isUndefined(obj) || obj === null;
export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object';
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(
  obj: { [prop: string]: any } | Array<any>,
  key: string,
): boolean {
  return hasOwnProperty.call(obj, key);
}

const queueTick = [];
let waiting = false;
export function nextTick(fn: () => void) {
  queueTick.push(fn);
  if (!waiting) {
    waiting = true;
    process.nextTick(() => {
      waiting = false;
      const copy = queueTick.slice(0);
      queueTick.length = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < copy.length; i++) {
        copy[i]();
      }
    });
  }
}
