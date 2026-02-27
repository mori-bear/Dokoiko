/**
 * JR 予約リンク
 * jrArea: "east" → えきねっと（緑）
 * jrArea: "west" → e5489（青）
 * jrArea: "kyushu" → JR九州（金土色）
 */
export function buildJrLinks(city) {
  const area = city.transport.jrArea;
  if (!area || area === 'none') return [];

  switch (area) {
    case 'east':
      return [{
        type: 'jr-east',
        label: '新幹線予約（えきねっと）',
        url: 'https://www.eki-net.com/',
        note: '一部列車は窓口購入のみの場合があります',
      }];
    case 'west':
      return [{
        type: 'jr-west',
        label: '新幹線予約（e5489）',
        url: 'https://www.jr-odekake.net/goyoyaku/',
        note: '一部列車は窓口購入のみの場合があります',
      }];
    case 'kyushu':
      return [{
        type: 'jr-kyushu',
        label: '新幹線予約（JR九州）',
        url: 'https://train.yoyaku.jrkyushu.co.jp/',
        note: '一部列車は窓口購入のみの場合があります',
      }];
    default:
      return [];
  }
}
