/**
 * 交通リンクビルダー
 *
 * 経路: Googleマップ transit のみ（Yahoo廃止）
 * JR: トップページ誘導のみ（検索結果直リンク禁止）
 * departure_time: 現在時刻+30分 UNIX秒
 */

/* ── Google Maps ── */

function googleMapsUrl(origin, destination) {
  const departure_time = Math.floor((Date.now() + 1800000) / 1000);
  return (
    'https://www.google.com/maps/dir/?api=1' +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    '&travelmode=transit' +
    `&departure_time=${departure_time}`
  );
}

export function buildGoogleMapsTransitLink(from, to) {
  return {
    type: 'google-maps',
    label: '経路を調べる（Googleマップ）',
    url: googleMapsUrl(from, to),
  };
}

export function buildGoogleMapsAirLink(fromStation, toAirportName) {
  return {
    type: 'google-maps',
    label: '空港への経路（Googleマップ）',
    url: googleMapsUrl(fromStation, toAirportName),
  };
}

export function buildGoogleMapsBusLink(fromCity, toBusTerminal) {
  return {
    type: 'bus',
    label: '高速バスを探す（Googleマップ）',
    url: googleMapsUrl(fromCity, toBusTerminal),
  };
}

/* ── JR ── */

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

export function buildJrExLink() {
  return {
    type: 'jr-ex',
    label: '新幹線を予約する（EX）',
    url: 'https://expy.jp/',
  };
}

/* ── 航空 ── */

export function buildSkyscannerLink(fromCode, toCode) {
  return {
    type: 'skyscanner',
    label: '航空券を比較する（Skyscanner）',
    url: `https://www.skyscanner.jp/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/`,
  };
}

/* ── フェリー ── */

export function buildFerryLink(portName) {
  return {
    type: 'ferry',
    label: `フェリーを見る（${portName}）`,
    url: `https://www.google.com/search?q=${encodeURIComponent(portName + ' フェリー 時刻表')}`,
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
