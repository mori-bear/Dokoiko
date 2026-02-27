/**
 * フェリーリンク
 * ferryUrl あり → リンク / なし → テキスト表示
 */
export function buildFerryLink(city) {
  if (!city.transport.ferry) return null;

  return {
    type: 'ferry',
    label: 'フェリーで渡る',
    url: city.transport.ferryUrl ?? null,
  };
}
