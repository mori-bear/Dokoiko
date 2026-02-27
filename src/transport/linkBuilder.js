/**
 * gatewayResolver が返したアイテムを { type, label, url } に変換する。
 *
 * 表示文言:
 *   経路を調べる / JRで予約する / レンタカーを探す
 *
 * JR予約サイトは出発地で振り分ける:
 *   えきねっと  : 札幌・仙台・東京
 *   e5489      : 名古屋・大阪・広島・高松
 *   JR九州     : 福岡
 */

const JR_EAST = ['札幌', '仙台', '東京'];
const JR_WEST = ['名古屋', '大阪', '広島', '高松'];

export function buildLink(item) {
  switch (item.type) {
    case 'yahoo':
      return {
        type: 'yahoo',
        label: '経路を調べる',
        url:
          'https://transit.yahoo.co.jp/search/result' +
          `?from=${encodeURIComponent(item.from)}` +
          `&to=${encodeURIComponent(item.to)}`,
      };

    case 'jr':
      return buildJrLink(item.departure);

    case 'rental':
      return {
        type: 'rental',
        label: 'レンタカーを探す',
        url: 'https://www.jalan.net/rentacar/',
      };

    default:
      return null;
  }
}

function buildJrLink(departure) {
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
