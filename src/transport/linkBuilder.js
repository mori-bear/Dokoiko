/**
 * 交通リンクビルダー
 *
 * 1. 鉄道: Yahoo乗換 + JR予約（railCompany分岐）
 * 2. 航空: Skyscanner + Googleマップ（出発地→空港）
 * 3. 高速バス: Googleマップ（出発地→目的地）
 * 4. フェリー: Google検索（港名）
 * 5. レンタカー: じゃらん
 */

/* ── 鉄道 ── */

export function buildYahooLink(from, to, datetime) {
  const { dateStr, timeStr } = parseDatetime(datetime);
  return {
    type: 'yahoo',
    label: '経路を調べる（Yahoo乗換）',
    url:
      'https://transit.yahoo.co.jp/search/result' +
      `?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&date=${dateStr}&time=${timeStr}&exp=1`,
  };
}

export function buildJrLink(railCompany) {
  switch (railCompany) {
    case 'east':
      return {
        type: 'jr-east',
        label: 'JRで予約する（えきねっと）',
        url: 'https://www.eki-net.com/top/pc/index.html',
      };
    case 'central_west_shikoku':
      return {
        type: 'jr-west',
        label: 'JRで予約する（e5489）',
        url: 'https://www.jr-odekake.net/goyoyaku/e5489/',
      };
    case 'kyushu':
      return {
        type: 'jr-kyushu',
        label: 'JRで予約する（九州ネット予約）',
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
  const { dateStr, timeStr } = parseDatetime(datetime);
  const timeLabel = `${dateStr.slice(0, 4)}年${dateStr.slice(4, 6)}月${dateStr.slice(6, 8)}日 ${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}発`;
  return {
    type: 'google-maps',
    label: `空港への経路（${timeLabel}）`,
    url:
      'https://www.google.com/maps/dir/?api=1' +
      `&origin=${encodeURIComponent(fromStation)}` +
      `&destination=${encodeURIComponent(toAirportName)}` +
      '&travelmode=transit',
  };
}

/* ── 高速バス ── */

export function buildGoogleMapsBusLink(fromCity, toBusTerminal, datetime) {
  const { dateStr, timeStr } = parseDatetime(datetime);
  const timeLabel = `${dateStr.slice(0, 4)}年${dateStr.slice(4, 6)}月${dateStr.slice(6, 8)}日 ${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}発`;
  return {
    type: 'bus',
    label: `高速バスで行く（${timeLabel}）`,
    url:
      'https://www.google.com/maps/dir/?api=1' +
      `&origin=${encodeURIComponent(fromCity)}` +
      `&destination=${encodeURIComponent(toBusTerminal)}` +
      '&travelmode=transit',
  };
}

/* ── フェリー ── */

export function buildFerryLink(portName) {
  return {
    type: 'ferry',
    label: `フェリー時刻表を調べる（${portName}）`,
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

/* ── 日時パース ── */

export function parseDatetime(datetime) {
  if (datetime) {
    const [datePart, timePart] = datetime.split('T');
    return {
      dateStr: datePart.replace(/-/g, ''),
      timeStr: (timePart ?? '0000').replace(':', '').slice(0, 4),
    };
  }
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  return { dateStr: fmtDate(d), timeStr: fmtTime(d) };
}

function fmtDate(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function fmtTime(d) {
  return `${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}
