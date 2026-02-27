/**
 * 抽選エンジン
 *
 * 優先順位:
 *   1. distanceLevel × budgetLevel 完全一致
 *   2. distance ±1、budget 完全一致
 *   3. distance 完全一致、budget ±1
 *   4. departure 一致のみ（任意距離・予算）
 *
 * 常に 1 件を返す。空配列にはならない。
 */
function pick(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function selectDestination(destinations, departure, distanceLevel, budgetLevel) {
  const byDeparture = destinations.filter((d) =>
    d.selection.departures.includes(departure)
  );

  // 1. 完全一致
  let pool = byDeparture.filter(
    (d) =>
      d.selection.distanceLevel === distanceLevel &&
      d.selection.budgetLevel === budgetLevel
  );
  if (pool.length > 0) return pick(pool);

  // 2. distance ±1、budget 完全一致
  for (const delta of [1, -1, 2, -2]) {
    const dl = distanceLevel + delta;
    if (dl < 1 || dl > 5) continue;
    pool = byDeparture.filter(
      (d) =>
        d.selection.distanceLevel === dl &&
        d.selection.budgetLevel === budgetLevel
    );
    if (pool.length > 0) return pick(pool);
  }

  // 3. distance 完全一致、budget ±1
  for (const delta of [1, -1]) {
    const bl = budgetLevel + delta;
    if (bl < 1 || bl > 3) continue;
    pool = byDeparture.filter(
      (d) =>
        d.selection.distanceLevel === distanceLevel &&
        d.selection.budgetLevel === bl
    );
    if (pool.length > 0) return pick(pool);
  }

  // 4. departure 一致のみ
  if (byDeparture.length > 0) return pick(byDeparture);

  // 5. 最終フォールバック（全国）
  return pick(destinations);
}
