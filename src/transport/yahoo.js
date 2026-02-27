import { DEPARTURE_STATIONS } from '../config/constants.js';

/**
 * Yahoo! 路線情報 URL 生成
 * - from: 出発地の代表駅
 * - to: destination.basic.mainStation
 * - exp=1 必須（有料特急を含む）
 */
export function buildYahooUrl(city, departure, date, time) {
  const fromStation = DEPARTURE_STATIONS[departure] ?? departure;
  const toStation = city.basic.mainStation;

  const { y, m, d } = resolveDate(date);
  const { hh, mm } = resolveTime(time);

  return (
    'https://transit.yahoo.co.jp/search/result' +
    `?from=${encodeURIComponent(fromStation)}` +
    `&to=${encodeURIComponent(toStation)}` +
    `&y=${y}&m=${m}&d=${d}` +
    `&hh=${hh}&m1=${mm}` +
    '&type=1&exp=1'
  );
}

function resolveDate(dateStr) {
  if (dateStr) {
    const [y, m, d] = dateStr.split('-');
    return { y, m: parseInt(m, 10), d: parseInt(d, 10) };
  }
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function resolveTime(timeStr) {
  if (timeStr) {
    const [hh, mm] = timeStr.split(':');
    return { hh, mm };
  }
  const now = new Date();
  return {
    hh: String(now.getHours()).padStart(2, '0'),
    mm: String(now.getMinutes()).padStart(2, '0'),
  };
}
