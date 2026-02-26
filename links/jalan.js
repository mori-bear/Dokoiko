/**
 * じゃらんnet 宿泊検索URL生成
 * prefectureベース検索
 *
 * 将来: JALAN_AFF_ID をバリューコマース ID に差し替えてアフィリエイトリンク化
 * 現在: keyword 検索形式の直リンク
 */
const JALAN_AFF_ID = 'YOUR_VALUECOMMERCE_ID';

export function generateJalanLink(destination) {
  return `https://www.jalan.net/uw/uwp2011/uww2011init.do?keyword=${encodeURIComponent(destination.prefecture)}`;
}
