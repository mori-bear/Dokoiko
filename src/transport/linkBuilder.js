/**
 * 交通リンクビルダー
 *
 * 鉄道・バス・フェリー: travelmode=transit（現在時刻+30分 UNIX秒）
 * 航空:               travelmode=driving（出発空港 → 目的空港）
 * JR予約:             各社トップページのみ（直リンク禁止）
 * EX:                東海道・山陽新幹線エリア
 */

/* ── 内部ユーティリティ ── */

function unixSec() {
  return Math.floor((Date.now() + 1800000) / 1000);
}

function transitUrl(origin, destination) {
  return (
    'https://www.google.com/maps/dir/?api=1' +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    '&travelmode=transit' +
    `&departure_time=${unixSec()}`
  );
}

function drivingUrl(origin, destination) {
  return (
    'https://www.google.com/maps/dir/?api=1' +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    '&travelmode=driving' +
    `&departure_time=${unixSec()}`
  );
}

/* ── 鉄道 ── */

export function buildRailLink(fromStation, toStation) {
  return {
    type: 'google-maps',
    label: `経路を調べる（${toStation} / Googleマップ）`,
    url: transitUrl(fromStation, toStation),
  };
}

/* ── JR予約 ── */

export function buildJrLink(region) {
  switch (region) {
    case 'east':
      return {
        type: 'jr-east',
        label: 'JRを予約する（えきねっと）',
        url: 'https://www.eki-net.com/',
      };
    case 'central_west_shikoku':
      return {
        type: 'jr-west',
        label: 'JRを予約する（e5489）',
        url: 'https://www.jr-odekake.net/goyoyaku/',
      };
    case 'kyushu':
      return {
        type: 'jr-kyushu',
        label: 'JRを予約する（九州ネット予約）',
        url: 'https://train.yoyaku.jrkyushu.co.jp/',
      };
    default:
      return null;
  }
}

/* ── EX（東海道・山陽新幹線） ── */

export function buildJrExLink() {
  return {
    type: 'jr-ex',
    label: '新幹線を予約する（EX）',
    url: 'https://expy.jp/',
  };
}

/* ── 航空 ── */

export function buildAirLink(fromAirport, toAirport) {
  return {
    type: 'google-maps',
    label: `フライト経路を確認する（${toAirport} / Googleマップ）`,
    url: drivingUrl(fromAirport, toAirport),
  };
}

/* ── 高速バス ── */

export function buildBusLink(fromCity, toBusTerminal) {
  return {
    type: 'bus',
    label: `高速バスを探す（${toBusTerminal} / Googleマップ）`,
    url: transitUrl(fromCity, toBusTerminal),
  };
}

/* ── フェリー ── */

export function buildFerryLink(fromStation, toTerminal) {
  return {
    type: 'ferry',
    label: `フェリー乗り場へ（${toTerminal} / Googleマップ）`,
    url: transitUrl(fromStation, toTerminal),
  };
}

/* ── レンタカー ── */

export function buildRentalLink(airportName) {
  return {
    type: 'rental',
    label: airportName
      ? `${airportName}でレンタカーを探す（じゃらん）`
      : 'レンタカーを探す（じゃらん）',
    url: 'https://www.jalan.net/rentacar/',
  };
}
