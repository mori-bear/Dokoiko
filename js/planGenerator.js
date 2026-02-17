/**
 * プラン生成ロジック
 * 条件フィルタリング＋完全ランダム抽選
 */

/**
 * 条件に合う目的地を絞り込む
 * @param {Array} destinations - 全目的地データ
 * @param {string} departureId - 出発地ID
 * @param {string} distance - 距離感（"near" | "far" | "any"）
 * @param {string} theme - テーマ（"view" | "food" | "experience" | "any"）
 * @returns {Array} 条件に合致する目的地の配列
 */
export function filterDestinations(destinations, departureId, distance, theme) {
  return destinations.filter(dest => {
    // この出発地からアクセス可能か
    const access = dest.access[departureId];
    if (!access) return false;

    // 距離感フィルタ
    if (distance !== 'any' && access.distance !== distance) return false;

    // テーマフィルタ
    if (theme !== 'any' && !dest.themes.includes(theme)) return false;

    return true;
  });
}

/**
 * 条件からプランをランダム生成
 * @param {Array} destinations - 全目的地データ
 * @param {string} departureId - 出発地ID
 * @param {string} distance - 距離感
 * @param {string} theme - テーマ
 * @returns {Object|null} 生成されたプラン、該当なしならnull
 */
export function generatePlan(destinations, departureId, distance, theme) {
  const candidates = filterDestinations(destinations, departureId, distance, theme);

  if (candidates.length === 0) return null;

  // 完全ランダム抽選
  const dest = candidates[Math.floor(Math.random() * candidates.length)];
  const access = dest.access[departureId];

  // モデルコースもランダムに選択
  const modelCourse = dest.modelCourses[
    Math.floor(Math.random() * dest.modelCourses.length)
  ];

  return {
    destination: dest,
    access,
    modelCourse,
    candidateCount: candidates.length
  };
}
