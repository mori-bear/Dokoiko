/**
 * 抽選エンジン
 *
 * 優先順位:
 *   1. departure + distanceLevel 完全一致
 *   2. distance ±1〜2
 *   3. departure 一致のみ
 *   4. 全国フォールバック
 *
 * stayType === 'daytrip' の場合、distanceLevel 5 を除外する。
 * 常に 1 件を返す。
 */
function pick(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function selectDestination(destinations, departure, distanceLevel, stayType) {
  const maxDL = stayType === 'daytrip' ? 4 : 5;

  const eligible = destinations.filter((d) => d.distanceLevel <= maxDL);
  const byDeparture = eligible.filter((d) => d.departures.includes(departure));

  // 1. 完全一致
  let pool = byDeparture.filter((d) => d.distanceLevel === distanceLevel);
  if (pool.length > 0) return pick(pool);

  // 2. distance ±1〜2
  for (const delta of [1, -1, 2, -2]) {
    const dl = distanceLevel + delta;
    if (dl < 1 || dl > maxDL) continue;
    pool = byDeparture.filter((d) => d.distanceLevel === dl);
    if (pool.length > 0) return pick(pool);
  }

  // 3. departure 一致のみ
  if (byDeparture.length > 0) return pick(byDeparture);

  // 4. 全国フォールバック
  if (eligible.length > 0) return pick(eligible);

  return pick(destinations);
}
