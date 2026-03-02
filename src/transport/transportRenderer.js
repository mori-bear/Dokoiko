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
 *   1. Googleマップ（railGatewayがある場合のみ）
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

  // 1. Googleマップ（railGatewayがある場合のみ）
  if (access.railGateway) {
    links.push(buildGoogleMapsLink(fromCity.rail, dest, datetime, 'transit'));
  }

  // 2. JR/私鉄予約（鉄道のみ）
  if (access.railGateway) {
    const provider = resolveRailProvider(departure, city);
    const jrLink = buildJrLink(provider);
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
 * 路線ベースでJR予約プロバイダを決定する。
 *
 * ルール:
 *   東北・北海道系  → えきねっと（JR東日本）
 *   東海道・山陽系  → EX（スマートEX / EX予約）
 *   九州内         → 九州ネット予約（福岡出発時のみ）
 *   九州・山陽経由  → e5489（福岡以外の出発から九州方面）
 *   北陸           → e5489（JR西日本管轄）
 *   関東           → えきねっと（JR東日本）
 */
function resolveRailProvider(departure, city) {
  const { region, name, access } = city;

  // 九州エリア
  if (region === '九州') {
    // 福岡出発の九州内移動はJR九州
    return departure === '福岡' ? 'jrkyushu' : 'e5489';
  }

  // 東北・北海道はえきねっと（JR東日本管轄）
  if (region === '東北' || region === '北海道') return 'ekinet';

  // 関東はえきねっと（JR東日本管轄）
  if (region === '関東') return 'ekinet';

  // 北陸（金沢・新潟）はe5489（JR西日本管轄）
  if (region === '中部' && (name === '金沢' || name === '新潟' || name === '富山')) {
    return 'e5489';
  }

  // 東海道・山陽系（近畿・中国・四国・中部の残り）はEX
  if (region === '近畿' || region === '中国' || region === '四国' || region === '中部') {
    return 'ex';
  }

  // フォールバック: データのrailBookingProviderを使用
  return access?.railBookingProvider || 'ekinet';
}
