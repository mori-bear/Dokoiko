import { DEPARTURE_CITY_INFO } from '../config/constants.js';
import {
  buildGoogleMapsLink,
  buildGoogleMapsLinkFromAirport,
  buildSkyscannerLink,
  buildJrLink,
  buildRentalLink,
} from './linkBuilder.js';

/**
 * 交通リンクを組み立てる（最大3リンク）。
 *
 * 優先順位:
 *   1. 鉄道 — Google Maps transit + JR予約（出発地別分岐）
 *   2. 航空 — Skyscanner（+ rail不在時: 空港GM + レンタカー）
 *   3. バス/フェリー — rail不在かつ枠が余る場合のみ
 *
 * 制約:
 *   - 物理的に存在しない交通手段は出さない
 *   - 合計最大3リンクに制限
 *   - Yahoo は使用しない
 *   - Google Maps の目的地は常に mapDestination
 */
export function resolveTransportLinks(city, departure, datetime) {
  const fromCity = DEPARTURE_CITY_INFO[departure];
  if (!fromCity) return [];

  const dest = city.mapDestination || city.name;
  const { access } = city;
  if (!access) return [];

  const links = [];

  // 1. 鉄道（最優先）
  if (access.rail) {
    const { bookingProvider } = access.rail;
    links.push(buildGoogleMapsLink(fromCity.rail, dest, datetime, 'transit'));
    const jrLink = buildJrLink(resolveBookingProvider(bookingProvider, departure));
    if (jrLink) links.push(jrLink);
  }

  // 2. 航空（枠が余る場合のみ追加）
  if (access.air && links.length < 3) {
    const { airportName } = access.air;
    const skyscanner = buildSkyscannerLink(fromCity.iata, airportName);
    if (skyscanner && links.length < 3) links.push(skyscanner);
    // rail不在の場合のみ: 空港→目的地の移動案内とレンタカーを追加
    if (!access.rail) {
      if (links.length < 3) links.push(buildGoogleMapsLinkFromAirport(airportName, dest, datetime));
      if (links.length < 3) links.push(buildRentalLink());
    }
  }

  // 3. 高速バス（rail不在＆枠が余る場合のみ）
  if (access.bus && !access.rail && links.length < 3) {
    links.push(buildGoogleMapsLink(fromCity.rail, dest, datetime, 'transit'));
  }

  // 4. フェリーのみ（rail・air不在＆枠が余る場合のみ）
  if (access.ferry && !access.rail && !access.air && links.length < 3) {
    links.push(buildGoogleMapsLink(access.ferry.portName, dest, datetime, 'transit'));
  }

  return links.filter(Boolean);
}

/**
 * 出発地と目的地のbookingProviderから最適なJR予約サービスを決定する。
 *
 * 分岐ルール:
 *   東京/仙台/札幌出発
 *     + jrkyushu → ex（九州新幹線はTokaido+Sanyo経由のEXが現実的）
 *     + その他   → データのまま
 *   名古屋出発（JR東海本拠地）
 *     + ekinet/e5489/jrkyushu → ex（東海道新幹線区間のEXが最適）
 *   大阪/広島/高松出発（JR西日本エリア）
 *     + ekinet → e5489（西日本から東日本向けはe5489経由が実用的）
 *   福岡出発（JR九州エリア）
 *     + ekinet/e5489 → ex（本州へはEX経由が自然）
 *   その他 → データのまま
 */
function resolveBookingProvider(dataProvider, departure) {
  if (!dataProvider) return null;

  switch (departure) {
    case '東京':
    case '仙台':
    case '札幌':
      if (dataProvider === 'jrkyushu') return 'ex';
      return dataProvider;

    case '名古屋':
      if (dataProvider === 'ekinet' || dataProvider === 'e5489' || dataProvider === 'jrkyushu') return 'ex';
      return dataProvider;

    case '大阪':
    case '広島':
    case '高松':
      if (dataProvider === 'ekinet') return 'e5489';
      return dataProvider;

    case '福岡':
      if (dataProvider === 'ekinet' || dataProvider === 'e5489') return 'ex';
      return dataProvider;

    default:
      return dataProvider;
  }
}
