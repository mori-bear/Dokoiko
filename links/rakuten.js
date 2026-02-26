/**
 * 楽天トラベル アフィリエイトURL生成
 * stayType が "1night" / "2night" のときのみ呼ばれる前提
 * prefectureベース検索で404を防ぐ
 */
const RAKUTEN_AFF_ID = '511c83ed.aa0fc172.511c83ee.51331b19';

export function buildRakutenUrl(destination, date, stayType) {
  const nights = stayType === '2night' ? 2 : 1;
  const checkIn = resolveCheckIn(date);
  const checkOut = addDays(checkIn, nights);

  const searchUrl =
    'https://travel.rakuten.co.jp/yado/search/' +
    `?f_nen1=${checkIn.y}&f_tuki1=${checkIn.m}&f_hi1=${checkIn.d}` +
    `&f_nen2=${checkOut.y}&f_tuki2=${checkOut.m}&f_hi2=${checkOut.d}` +
    `&f_heya_su=1&f_otona_su=2&f_keyword=${encodeURIComponent(destination.prefecture)}`;

  return (
    `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFF_ID}/` +
    `?pc=${encodeURIComponent(searchUrl)}`
  );
}

function resolveCheckIn(dateStr) {
  if (dateStr) {
    const [y, m, d] = dateStr.split('-');
    return { y: parseInt(y, 10), m: parseInt(m, 10), d: parseInt(d, 10) };
  }
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function addDays({ y, m, d }, n) {
  const dt = new Date(y, m - 1, d + n);
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() };
}
