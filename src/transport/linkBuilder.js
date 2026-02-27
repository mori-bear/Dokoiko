/**
 * 交通リンクビルダー
 *
 * Yahoo乗換: from/to + 出発日時 (date=YYYYMMDD&time=HHMM&exp=1)
 * JR予約: 出発地で振り分け (えきねっと / e5489 / JR九州)
 * Skyscanner: from/to の IATA コード
 * レンタカー: じゃらん
 */

const JR_EAST   = ['札幌', '仙台', '東京'];
const JR_WEST   = ['名古屋', '大阪', '広島', '高松'];

export function buildYahooLink(from, to, datetime) {
  const { dateStr, timeStr } = parseDatetime(datetime);
  return {
    type: 'yahoo',
    label: '経路を調べる',
    url:
      'https://transit.yahoo.co.jp/search/result' +
      `?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&date=${dateStr}&time=${timeStr}&exp=1`,
  };
}

export function buildJrLink(departure) {
  if (JR_EAST.includes(departure)) {
    return {
      type: 'jr-east',
      label: 'JRで予約する',
      url: 'https://www.eki-net.com/',
    };
  }
  if (JR_WEST.includes(departure)) {
    return {
      type: 'jr-west',
      label: 'JRで予約する',
      url: 'https://www.jr-odekake.net/goyoyaku/e5489/',
    };
  }
  return {
    type: 'jr-kyushu',
    label: 'JRで予約する',
    url: 'https://train.yoyaku.jrkyushu.co.jp/',
  };
}

export function buildSkyscannerLink(fromCode, toCode) {
  return {
    type: 'skyscanner',
    label: '航空券を探す',
    url: `https://www.skyscanner.jp/transport/flights/${fromCode}/${toCode}/`,
  };
}

export function buildRentalLink() {
  return {
    type: 'rental',
    label: 'レンタカーを探す',
    url: 'https://www.jalan.net/rentacar/',
  };
}

/* ── 日時パース ── */

function parseDatetime(datetime) {
  if (datetime) {
    const [datePart, timePart] = datetime.split('T');
    return {
      dateStr: datePart.replace(/-/g, ''),
      timeStr: (timePart ?? '0000').replace(':', '').slice(0, 4),
    };
  }
  // フォールバック: 現在時刻 + 30分
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
