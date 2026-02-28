import { DEPARTURE_CITY_INFO } from '../config/constants.js';
import {
  buildGoogleMapsTransitLink,
  buildGoogleMapsAirLink,
  buildGoogleMapsBusLink,
  buildJrLink,
  buildJrExLink,
  buildSkyscannerLink,
  buildFerryLink,
  buildRentalLink,
} from './linkBuilder.js';

/**
 * 交通リンクを組み立てる。
 *
 * city.gateways が配列形式 → 新ゲートウェイモデル
 * city.transportHubs が文字列形式 → 旧ハブモデル（後方互換）
 *
 * 表示順（新モデル）:
 *   1. 鉄道  — Google Maps + JR予約
 *   2. EX   — 東海道・山陽新幹線エリアのみ
 *   3. 航空  — Google Maps（出発地→空港）
 *   4. バス  — Google Maps
 *   5. レンタカー — air gateway 存在時のみ
 */
export function resolveTransportLinks(city, departure) {
  if (city.gateways && Array.isArray(city.gateways.rail)) {
    return resolveGatewayLinks(city, departure);
  }
  return resolveHubLinks(city, departure);
}

/* ── 新ゲートウェイモデル ── */

function resolveGatewayLinks(city, departure) {
  const fromCity = DEPARTURE_CITY_INFO[departure];
  const fromRail = fromCity.gateways.rail || departure;
  const { gateways } = city;
  const links = [];
  let hasEx = false;

  // 1. 鉄道
  for (const gw of gateways.rail || []) {
    links.push(buildGoogleMapsTransitLink(fromRail, gw.name));
    const jrLink = buildJrLink(gw.region);
    if (jrLink) links.push(jrLink);
    if (gw.region === 'central_west_shikoku') hasEx = true;
  }

  // 2. EX（東海道・山陽新幹線）
  if (hasEx) {
    links.push(buildJrExLink());
  }

  // 3. 航空
  const airGateways = gateways.air || [];
  for (const gw of airGateways) {
    links.push(buildGoogleMapsAirLink(fromRail, gw.name));
  }

  // 4. バス
  for (const gw of gateways.bus || []) {
    links.push(buildGoogleMapsBusLink(departure, gw.name));
  }

  // 5. レンタカー（air gateway 存在時）
  for (const gw of airGateways) {
    links.push(buildRentalLink(gw.name));
  }

  return links.filter(Boolean);
}

/* ── 旧ハブモデル（後方互換） ── */

function resolveHubLinks(city, departure) {
  const fromCity = DEPARTURE_CITY_INFO[departure];
  const hubs = city.transportHubs;
  const links = [];

  // 1. 鉄道
  if (hubs.rail) {
    const fromRail = fromCity.gateways.rail || departure;
    links.push(buildGoogleMapsTransitLink(fromRail, hubs.rail));
    if (city.railCompany) {
      links.push(buildJrLink(city.railCompany));
    }
  }

  // 2. 航空
  if (hubs.air && fromCity.gateways.air) {
    links.push(buildSkyscannerLink(fromCity.gateways.air, hubs.air));
    const airportLabel = getAirportLabel(hubs.air);
    links.push(buildGoogleMapsAirLink(fromCity.gateways.rail || departure, airportLabel));
  }

  // 3. 高速バス
  if (hubs.bus) {
    links.push(buildGoogleMapsBusLink(departure, hubs.bus));
  }

  // 4. フェリー
  if (hubs.ferry) {
    links.push(buildFerryLink(hubs.ferry));
  }

  // 5. レンタカー（航空利用・フェリー・島・自然系）
  if (hubs.air || hubs.ferry || city.type === 'island' || city.type === 'rural') {
    links.push(buildRentalLink());
  }

  return links.filter(Boolean);
}

/** IATAコード → 空港名 */
function getAirportLabel(iata) {
  const map = {
    CTS: '新千歳空港',
    OKA: '那覇空港',
    ISG: '石垣空港',
    FUK: '福岡空港',
    SDJ: '仙台空港',
    HIJ: '広島空港',
    TAK: '高松空港',
    NGO: '中部国際空港',
    TYO: '羽田空港',
    OSA: '関西国際空港',
    KMI: '宮崎空港',
    MYJ: '松山空港',
    KUH: '釧路空港',
  };
  return map[iata] || `${iata}空港`;
}
