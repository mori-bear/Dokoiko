/**
 * プラン生成ロジック
 * 条件フィルタリング＋完全ランダム抽選（履歴管理・フォールバック付き）
 */

/** 直近の抽選履歴（連続重複を防ぐ） */
let _history = [];
const MAX_HISTORY = 5;

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
    const access = dest.access[departureId];
    if (!access) return false;
    if (distance !== 'any' && access.distance !== distance) return false;
    if (theme !== 'any' && !dest.themes.includes(theme)) return false;
    return true;
  });
}

/**
 * 配列からランダムに1件選択（履歴を考慮し連続重複を回避）
 * @param {Array} candidates - 候補配列
 * @returns {*} 選択された要素
 */
function pickRandom(candidates) {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  // 履歴にない候補を優先
  const fresh = candidates.filter(c => !_history.includes(c.id));
  const pool = fresh.length > 0 ? fresh : candidates;

  const index = Math.floor(Math.random() * pool.length);
  const picked = pool[index];

  console.log('[Dokoiko] pickRandom:', {
    totalCandidates: candidates.length,
    freshCandidates: fresh.length,
    poolSize: pool.length,
    rolledIndex: index,
    pickedId: picked.id
  });

  return picked;
}

/**
 * 履歴を更新
 */
function pushHistory(destId) {
  _history.push(destId);
  if (_history.length > MAX_HISTORY) {
    _history = _history.slice(-MAX_HISTORY);
  }
}

/**
 * 履歴をリセット（テスト用途 or 出発地変更時）
 */
export function resetHistory() {
  _history = [];
  console.log('[Dokoiko] 抽選履歴をリセット');
}

/**
 * フォールバック付きフィルタリング
 * 段階的に条件を緩和して候補を探す
 * @returns {{ candidates: Array, relaxed: string|null }}
 */
function filterWithFallback(destinations, departureId, distance, theme) {
  // Step 1: 完全一致
  let candidates = filterDestinations(destinations, departureId, distance, theme);
  if (candidates.length > 0) {
    console.log('[Dokoiko] フィルタ: 完全一致 →', candidates.length, '件');
    return { candidates, relaxed: null };
  }

  // Step 2: テーマを緩和
  if (theme !== 'any') {
    candidates = filterDestinations(destinations, departureId, distance, 'any');
    if (candidates.length > 0) {
      console.log('[Dokoiko] フィルタ: テーマ緩和 →', candidates.length, '件');
      return { candidates, relaxed: 'theme' };
    }
  }

  // Step 3: 距離を緩和
  if (distance !== 'any') {
    candidates = filterDestinations(destinations, departureId, 'any', theme);
    if (candidates.length > 0) {
      console.log('[Dokoiko] フィルタ: 距離緩和 →', candidates.length, '件');
      return { candidates, relaxed: 'distance' };
    }
  }

  // Step 4: テーマ・距離両方を緩和
  candidates = filterDestinations(destinations, departureId, 'any', 'any');
  if (candidates.length > 0) {
    console.log('[Dokoiko] フィルタ: 全条件緩和 →', candidates.length, '件');
    return { candidates, relaxed: 'both' };
  }

  // Step 5: この出発地から行ける場所がゼロ
  console.warn('[Dokoiko] フィルタ: 該当なし（出発地に紐づくデータなし）');
  return { candidates: [], relaxed: null };
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
  console.log('[Dokoiko] === 抽選開始 ===');
  console.log('[Dokoiko] 条件:', { departureId, distance, theme });
  console.log('[Dokoiko] 全データ件数:', destinations.length);

  const { candidates, relaxed } = filterWithFallback(
    destinations, departureId, distance, theme
  );

  if (candidates.length === 0) {
    console.warn('[Dokoiko] 候補0件 → null返却');
    return null;
  }

  // ランダム抽選（履歴考慮）
  const dest = pickRandom(candidates);
  pushHistory(dest.id);

  const access = dest.access[departureId];

  // モデルコースもランダムに選択
  const courseIndex = Math.floor(Math.random() * dest.modelCourses.length);
  const modelCourse = dest.modelCourses[courseIndex];

  console.log('[Dokoiko] 抽選結果:', {
    destination: dest.city,
    prefecture: dest.prefecture,
    modelCourse,
    candidateCount: candidates.length,
    relaxed,
    history: [..._history]
  });
  console.log('[Dokoiko] === 抽選完了 ===');

  return {
    destination: dest,
    access,
    modelCourse,
    candidateCount: candidates.length,
    relaxed
  };
}
