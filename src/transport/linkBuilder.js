/**
 * 交通リンクビルダー
 *
 * 1. 鉄道: Googleマップ（経路） + JR予約（railCompany分岐）
 * 2. 航空: Skyscanner + Googleマップ（出発地→空港）
 * 3. 高速バス: Googleマップ（出発地→目的地）
 * 4. フェリー: Google検索（港名）
 * 5. レンタカー: じゃらん
 *
 * Googleマップリンク共通仕様:
 *   https://www.google.com/maps/dir/?api=1
 *     &origin={from}
 *     &destination={to}
 *     &travelmode=transit
 *     &departure_time={UNIX秒}
 */

/* ── 鉄道 ── */

export function buildGoogleMapsTransitLink(from, to, datetime) {
  const unixSec = toUnixSec(datetime);
  return {
    type: 'google-maps',
    label: '経路を調べる（Googleマップ）',
    url:
      'https://www.google.com/maps/dir/?api=1' +
      `&origin=${encodeURIComponent(from)}` +
      `&destination=${encodeURIComponent(to)}` +
      '&travelmode=transit' +
      `&departure_time=${unixSec}`,
  };
}

export function buildJrLink(railCompany) {
  switch (railCompany) {
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

/* ── 航空 ── */

export function buildSkyscannerLink(fromCode, toCode) {
  return {
    type: 'skyscanner',
    label: '航空券を比較する（Skyscanner）',
    url: `https://www.skyscanner.jp/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/`,
  };
}

export function buildGoogleMapsAirLink(fromStation, toAirportName, datetime) {
  const unixSec = toUnixSec(datetime);
  return {
    type: 'google-maps',
    label: `空港への経路（Googleマップ）`,
    url:
      'https://www.google.com/maps/dir/?api=1' +
      `&origin=${encodeURIComponent(fromStation)}` +
      `&destination=${encodeURIComponent(toAirportName)}` +
      '&travelmode=transit' +
      `&departure_time=${unixSec}`,
  };
}

/* ── 高速バス ── */

export function buildGoogleMapsBusLink(fromCity, toBusTerminal, datetime) {
  const unixSec = toUnixSec(datetime);
  return {
    type: 'bus',
    label: '高速バスを探す（Googleマップ）',
    url:
      'https://www.google.com/maps/dir/?api=1' +
      `&origin=${encodeURIComponent(fromCity)}` +
      `&destination=${encodeURIComponent(toBusTerminal)}` +
      '&travelmode=transit' +
      `&departure_time=${unixSec}`,
  };
}

/* ── フェリー ── */

export function buildFerryLink(portName) {
  return {
    type: 'ferry',
    label: `フェリー情報を見る（${portName}）`,
    url: `https://www.google.com/search?q=${encodeURIComponent(portName + ' フェリー 時刻表')}`,
  };
}

/* ── レンタカー ── */

export function buildRentalLink() {
  return {
    type: 'rental',
    label: 'レンタカーを探す（じゃらん）',
    url: 'https://www.jalan.net/rentacar/',
  };
}

/* ── 日時ユーティリティ ── */

/** datetime-local 文字列 → Unix秒（未入力時は現在+30分） */
export function toUnixSec(datetime) {
  if (datetime) {
    return Math.floor(new Date(datetime).getTime() / 1000);
  }
  return Math.floor((Date.now() + 30 * 60 * 1000) / 1000);
}
