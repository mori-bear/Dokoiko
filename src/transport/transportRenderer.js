import { DEPARTURE_CITY_INFO } from '../config/constants.js';
import {
  buildYahooLink,
  buildJrLink,
  buildSkyscannerLink,
  buildRentalLink,
} from './linkBuilder.js';

/**
 * 交通リンクを組み立てる。
 *
 * 表示順:
 *   1. Yahoo乗換（常時）
 *   2. JR予約（fromCity.hasJR && toCity.hasJR）
 *   3. Skyscanner（fromCity.hasAirport && toCity.hasAirport）
 *   4. レンタカー（航空路線がある場合、または requiresLocalTransport）
 */
export function resolveTransportLinks(city, departure, datetime) {
  const fromCity = DEPARTURE_CITY_INFO[departure];
  const links = [];

  // 1. Yahoo乗換（鉄道があれば駅名、なければ都市名）
  const fromPoint = fromCity.hasJR ? fromCity.gateways.rail : departure;
  const toPoint   = city.hasJR     ? city.gateways.rail     : city.name;
  links.push(buildYahooLink(fromPoint, toPoint, datetime));

  // 2. JR予約
  if (fromCity.hasJR && city.hasJR) {
    links.push(buildJrLink(departure));
  }

  // 3. Skyscanner + レンタカー（航空路線）
  if (fromCity.hasAirport && city.hasAirport) {
    links.push(buildSkyscannerLink(fromCity.gateways.air, city.gateways.air));
    links.push(buildRentalLink());
  } else if (city.requiresLocalTransport) {
    // 航空路線なし、かつローカル交通が必要な場合のみレンタカー
    links.push(buildRentalLink());
  }

  return links.filter(Boolean);
}
