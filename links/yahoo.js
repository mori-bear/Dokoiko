/**
 * Yahoo!路線情報 乗換案内 URL生成
 *
 * ルール（厳守）:
 *   - date / time にフォーム値がある場合は必ずそれを使う
 *   - 未入力の場合のみ現在日時をセット
 *   - フォーム値を現在日時で上書きしない
 *   - from は UI選択の出発地（departure）を使う
 *   - to は destination.mainStation を使う
 *   - exp=1 必須
 */
export function buildYahooUrl(destination, date, time, departure) {
  const now = new Date();
  const { y, m, d } = resolveDate(date, now);
  const { hh, mm } = resolveTime(time, now);

  const from = encodeURIComponent(departure);
  const to = encodeURIComponent(destination.mainStation);

  return (
    'https://transit.yahoo.co.jp/search/result' +
    `?from=${from}&to=${to}` +
    `&y=${y}&m=${m}&d=${d}` +
    `&hh=${hh}&m1=${mm}` +
    '&type=1&exp=1'
  );
}

function resolveDate(dateStr, fallback) {
  if (dateStr) {
    const [y, m, d] = dateStr.split('-');
    return { y, m: parseInt(m, 10), d: parseInt(d, 10) };
  }
  return {
    y: fallback.getFullYear(),
    m: fallback.getMonth() + 1,
    d: fallback.getDate(),
  };
}

function resolveTime(timeStr, fallback) {
  if (timeStr) {
    const [hh, mm] = timeStr.split(':');
    return { hh, mm };
  }
  return {
    hh: String(fallback.getHours()).padStart(2, '0'),
    mm: String(fallback.getMinutes()).padStart(2, '0'),
  };
}
