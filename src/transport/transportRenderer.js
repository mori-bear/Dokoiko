import { DEPARTURE_CITY_INFO } from '../config/constants.js';
import {
  buildGoogleMapsTransitLink,
  buildGoogleMapsAirLink,
  buildGoogleMapsBusLink,
  buildJrLink,
  buildSkyscannerLink,
  buildFerryLink,
  buildRentalLink,
} from './linkBuilder.js';

/**
 * 交通リンクを組み立てる。
 *
 * 表示順（transportHubs に存在する手段のみ表示）:
 *   1. 鉄道  — Googleマップ経路 + JR予約
 *   2. 航空  — Skyscanner + Googleマップ（出発地→空港）
 *   3. 高速バス — Googleマップ
 *   4. フェリー — Google検索
 *   5. レンタカー — 航空/フェリー/island/rural 時
 */
export function resolveTransportLinks(city, departure, datetime) {
  const fromCity = DEPARTURE_CITY_INFO[departure];
  const hubs = city.transportHubs;
  const links = [];

  // 1. 鉄道
  if (hubs.rail) {
    const fromRail = fromCity.gateways.rail || departure;
    links.push(buildGoogleMapsTransitLink(fromRail, hubs.rail, datetime));
    if (city.railCompany) {
      links.push(buildJrLink(city.railCompany));
    }
  }

  // 2. 航空
  if (hubs.air && fromCity.gateways.air) {
    links.push(buildSkyscannerLink(fromCity.gateways.air, hubs.air));
    const airportLabel = getAirportLabel(hubs.air);
    links.push(buildGoogleMapsAirLink(fromCity.gateways.rail || departure, airportLabel, datetime));
  }

  // 3. 高速バス
  if (hubs.bus) {
    links.push(buildGoogleMapsBusLink(departure, hubs.bus, datetime));
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
