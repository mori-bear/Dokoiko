import { DEPARTURE_AIRPORT_CODES } from '../config/constants.js';

/**
 * スカイスキャナー 航空券検索リンク
 */
export function buildFlightLink(city, departure, date) {
  if (!city.transport.flight) return null;

  const fromCode = (DEPARTURE_AIRPORT_CODES[departure] ?? 'TYO').toLowerCase();
  const toCode = (city.transport.flightCode ?? 'OKA').toLowerCase();
  const dateStr = (date ?? todayStr()).replace(/-/g, '');

  return {
    type: 'flight',
    label: '航空券を探す（スカイスキャナー）',
    url: `https://www.skyscanner.jp/transport/flights/${fromCode}/${toCode}/${dateStr}/`,
  };
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
