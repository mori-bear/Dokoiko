/**
 * 交通リンクアセンブラ
 *
 * 表示順（仕様）:
 *   1. Yahoo乗換（常時・出発地依存）
 *   2. JR予約（えきねっと / e5489 / JR九州）
 *   3. 飛行機（スカイスキャナー）
 *   4. 高速バス
 *   5. フェリー
 */
import { buildYahooUrl } from './yahoo.js';
import { buildJrLinks } from './jr.js';
import { buildFlightLink } from './flight.js';
import { buildBusLink } from './bus.js';
import { buildFerryLink } from './ferry.js';

export function buildTransportLinks(city, departure, date, time) {
  const links = [];

  // 1. Yahoo乗換（常時）
  links.push({
    type: 'yahoo',
    label: '乗換案内（Yahoo!路線情報）',
    url: buildYahooUrl(city, departure, date, time),
  });

  // 2. JR予約
  const jrLinks = buildJrLinks(city);
  links.push(...jrLinks);

  // 3. 飛行機
  const flightLink = buildFlightLink(city, departure, date);
  if (flightLink) links.push(flightLink);

  // 4. 高速バス
  const busLink = buildBusLink(city);
  if (busLink) links.push(busLink);

  // 5. フェリー
  const ferryLink = buildFerryLink(city);
  if (ferryLink) links.push(ferryLink);

  return links;
}
