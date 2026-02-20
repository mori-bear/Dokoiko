/**
 * プラン生成ロジック
 * 条件フィルタリング＋完全ランダム抽選（履歴管理・フォールバック付き）
 */

import { DIFFICULTY_RANGES, getRegionMultiplier, calcDistanceLevel } from './config.js';

/** 直近の抽選履歴（連続重複を防ぐ） */
let _history = [];
const MAX_HISTORY = 5;

/**
 * 条件に合う目的地を絞り込む
 * @param {Array} destinations - 全目的地データ
 * @param {string} departureId - 出発地ID
 * @param {string} distance - 距離感（"near" | "far" | "any"）
 * @param {string} theme - テーマ（"view" | "food" | "experience" | "any"）
 * @param {string} difficulty - 難易度（"easy" | "normal" | "hard" | "any"）
 * @param {string} stay - 滞在タイプ（"daytrip" | "1night" | "2night" | "any"）
 * @returns {Array} 条件に合致する目的地の配列
 */
export function filterDestinations(destinations, departureId, distance, theme, difficulty = 'any', stay = 'any') {
  const diffRange = difficulty !== 'any' ? DIFFICULTY_RANGES[difficulty] : null;
  return destinations.filter(dest => {
    const access = dest.access[departureId];
    if (!access) return false;
    if (distance !== 'any' && access.distance !== distance) return false;
    if (theme !== 'any' && !dest.themes.includes(theme)) return false;
    if (diffRange && (dest.difficulty < diffRange[0] || dest.difficulty > diffRange[1])) return false;
    if (stay !== 'any' && (!dest.staySupport || !dest.staySupport.includes(stay))) return false;
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
function filterWithFallback(destinations, departureId, distance, theme, difficulty, stay) {
  // Step 1: 完全一致
  let candidates = filterDestinations(destinations, departureId, distance, theme, difficulty, stay);
  if (candidates.length > 0) {
    console.log('[Dokoiko] フィルタ: 完全一致 →', candidates.length, '件');
    return { candidates, relaxed: null };
  }

  // Step 2: テーマを緩和
  if (theme !== 'any') {
    candidates = filterDestinations(destinations, departureId, distance, 'any', difficulty, stay);
    if (candidates.length > 0) {
      console.log('[Dokoiko] フィルタ: テーマ緩和 →', candidates.length, '件');
      return { candidates, relaxed: 'theme' };
    }
  }

  // Step 3: 距離を緩和
  if (distance !== 'any') {
    candidates = filterDestinations(destinations, departureId, 'any', theme, difficulty, stay);
    if (candidates.length > 0) {
      console.log('[Dokoiko] フィルタ: 距離緩和 →', candidates.length, '件');
      return { candidates, relaxed: 'distance' };
    }
  }

  // Step 4: テーマ・距離両方を緩和（難易度・滞在は維持）
  candidates = filterDestinations(destinations, departureId, 'any', 'any', difficulty, stay);
  if (candidates.length > 0) {
    console.log('[Dokoiko] フィルタ: テーマ+距離緩和 →', candidates.length, '件');
    return { candidates, relaxed: 'both' };
  }

  // Step 5: 難易度・滞在も緩和
  candidates = filterDestinations(destinations, departureId, 'any', 'any', 'any', 'any');
  if (candidates.length > 0) {
    console.log('[Dokoiko] フィルタ: 全条件緩和 →', candidates.length, '件');
    return { candidates, relaxed: 'both' };
  }

  // Step 6: この出発地から行ける場所がゼロ
  console.warn('[Dokoiko] フィルタ: 該当なし（出発地に紐づくデータなし）');
  return { candidates: [], relaxed: null };
}

/**
 * 条件からプランをランダム生成
 * @param {Array} destinations - 全目的地データ
 * @param {Object} departure - 出発地オブジェクト { id, label, region }
 * @param {string} distance - 距離感
 * @param {string} theme - テーマ
 * @param {string} difficulty - 難易度
 * @param {string} stay - 滞在タイプ
 * @returns {Object|null} 生成されたプラン、該当なしならnull
 */
export function generatePlan(destinations, departure, distance, theme, difficulty = 'any', stay = 'any') {
  const departureId = departure.id;
  console.log('[Dokoiko] === 抽選開始 ===');
  console.log('[Dokoiko] 条件:', { departureId, distance, theme, difficulty, stay });
  console.log('[Dokoiko] 全データ件数:', destinations.length);

  const { candidates, relaxed } = filterWithFallback(
    destinations, departureId, distance, theme, difficulty, stay
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

  // 動的距離★算出
  const multiplier = getRegionMultiplier(departure.region, dest.region);
  const estimatedHours = Math.round(dest.baseTravelHours * multiplier * 10) / 10;
  const dynamicDistanceLevel = calcDistanceLevel(estimatedHours);

  console.log('[Dokoiko] 距離算出:', {
    depRegion: departure.region,
    destRegion: dest.region,
    baseTravelHours: dest.baseTravelHours,
    multiplier,
    estimatedHours,
    dynamicDistanceLevel
  });

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
    departure,
    access,
    modelCourse,
    candidateCount: candidates.length,
    relaxed,
    estimatedHours,
    dynamicDistanceLevel
  };
}
