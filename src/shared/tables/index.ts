import * as moment from 'moment';

export function toStoreDate(date, DBformat?, dateFormat?) {
  DBformat = DBformat || 'yyyymmdd HH24:Mi:SS';
  dateFormat = dateFormat || 'YYYYMMDD HH:mm:ss';
  const m = moment(date);
  if (date && m.isValid()) {
    return `to_date('${m.format(dateFormat)}','${DBformat}')`;
  } else {
    return `''`;
  }
}

export function toStoreString(s) {
  if (typeof s === 'string') {
    s = s.replace(/\'/g, '’').replace(/\;/, '；');
    return `'${s}'`;
  } else {
    return `''`;
  }
}

export function getStoreDateRange(date: string) {
  const _rq_date = date || '';
  const _rq_date_arr = _rq_date.split(',');
  const _rq_date_f = toStoreDate(_rq_date_arr[0], 'yyyymmdd', 'YYYYMMDD');
  const _rq_date_t = toStoreDate(_rq_date_arr[1], 'yyyymmdd', 'YYYYMMDD');
  return [_rq_date_f, _rq_date_t];
}
