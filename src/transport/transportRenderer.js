import { DEPARTURE_CITY_INFO } from '../config/constants.js';
import {
  buildGoogleMapsLink,
  buildSkyscannerLink,
  buildJrLink,
  buildRentalLink,
} from './linkBuilder.js';

/**
 * 交通リンクを組み立てる。
 *
 * 表示順:
 *   1. Googleマップ（鉄道のみ）
 *   2. JR/私鉄予約（鉄道のみ）
 *   3. 航空券比較（air、rail不在のみ）
 *   4. レンタカー（air、rail不在のみ）
 *   5. フェリーのみの場合: Googleマップ（出発駅→港）
 */
export function resolveTransportLinks(city, departure, datetime) {
  const fromCity = DEPARTURE_CITY_INFO[departure];
  if (!fromCity) return [];

  const dest = city.mapDestination || city.name;
  const { access } = city;
  if (!access) return [];

  const links = [];

  // 1. Googleマップ（鉄道のみ）
  if (access.railGateway) {
    links.push(buildGoogleMapsLink(fromCity.rail, dest, datetime, 'transit'));
  }

  // 2. JR/私鉄予約（鉄道のみ）
  if (access.railGateway && access.railBookingProvider) {
    const jrLink = buildJrLink(resolveBookingProvider(access.railBookingProvider, departure));
    if (jrLink) links.push(jrLink);
  }

  // 3 & 4. 航空（rail不在のみ）
  if (access.airportGateway && !access.railGateway && links.length < 3) {
    const skyscanner = buildSkyscannerLink(fromCity.iata, access.airportGateway);
    if (skyscanner && links.length < 3) links.push(skyscanner);
    if (links.length < 3) links.push(buildRentalLink());
  }

  // 5. フェリーのみ（rail・air不在）
  if (access.ferryGateway && !access.railGateway && !access.airportGateway && links.length < 3) {
    links.push(buildGoogleMapsLink(fromCity.rail, access.ferryGateway, datetime, 'transit'));
  }

  return links.filter(link => link && link.url);
}

/**
 * 出発地×目的地のbookingProviderから最適なJR予約サービスを決定する。
 */
function resolveBookingProvider(dataProvider, departure) {
  if (!dataProvider) return null;

  switch (departure) {
    case '東京':
    case '仙台':
    case '札幌':
      if (dataProvider === 'jrkyushu') return 'e5489';
      return dataProvider;

    case '名古屋':
      if (dataProvider === 'ekinet' || dataProvider === 'e5489') return 'ex';
      if (dataProvider === 'jrkyushu') return 'ex';
      return dataProvider;

    case '大阪':
    case '広島':
    case '高松':
      if (dataProvider === 'ekinet') return 'e5489';
      if (dataProvider === 'jrkyushu') return 'e5489';
      return dataProvider;

    case '福岡':
      if (dataProvider === 'ekinet') return 'e5489';
      if (dataProvider === 'e5489') return 'e5489';
      return dataProvider;

    default:
      return dataProvider;
  }
}
