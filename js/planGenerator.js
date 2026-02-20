/**
 * プラン生成ロジック
 * 条件フィルタリング＋完全ランダム抽選（履歴管理・フォールバック付き）
 */

import { getRegionMultiplier, calcDistanceLevel } from './config.js';

/** 直近の抽選履歴（連続重複を防ぐ） */
let _history = [];
const MAX_HISTORY = 5;

/**
 * 条件に合う目的地を絞り込む
 */
export function filterDestinations(
  destinations,
  departureId,
  distance,
  theme,
  stay = 'any'
) {
  return destinations.filter(dest => {
    const access = dest.access[departureId];
    if (!access) return false;
    if (distance !== 'any' && access.distance !== distance) return false;
    if (theme !== 'any' && !dest.themes.includes(theme)) return false;
    if (stay !== 'any' && (!dest.staySupport || !dest.staySupport.includes(stay))) return false;
    return true;
  });
}

/**
 * ランダム選択（履歴考慮）
 */
function pickRandom(candidates) {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const fresh = candidates.filter(c => !_history.includes(c.id));
  const pool = fresh.length > 0 ? fresh : candidates;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function pushHistory(destId) {
  _history.push(destId);
  if (_history.length > MAX_HISTORY) {
    _history = _history.slice(-MAX_HISTORY);
  }
}

export function resetHistory() {
  _history = [];
}

/**
 * フォールバック付きフィルタ
 */
function filterWithFallback(
  destinations,
  departureId,
  distance,
  theme,
  stay
) {
  let candidates = filterDestinations(
    destinations,
    departureId,
    distance,
    theme,
    stay
  );

  if (candidates.length > 0) return { candidates, relaxed: null };

  // テーマ緩和
  if (theme !== 'any') {
    candidates = filterDestinations(
      destinations,
      departureId,
      distance,
      'any',
      stay
    );
    if (candidates.length > 0) {
      return { candidates, relaxed: 'theme' };
    }
  }

  // 距離緩和
  if (distance !== 'any') {
    candidates = filterDestinations(
      destinations,
      departureId,
      'any',
      theme,
      stay
    );
    if (candidates.length > 0) {
      return { candidates, relaxed: 'distance' };
    }
  }

  // 全緩和
  candidates = filterDestinations(
    destinations,
    departureId,
    'any',
    'any',
    'any'
  );

  return { candidates, relaxed: 'all' };
}

/**
 * プラン生成
 */
export function generatePlan(
  destinations,
  departure,
  distance,
  theme,
  stay = 'any'
) {
  const departureId = departure.id;

  const { candidates, relaxed } = filterWithFallback(
    destinations,
    departureId,
    distance,
    theme,
    stay
  );

  if (candidates.length === 0) return null;

  const dest = pickRandom(candidates);
  pushHistory(dest.id);

  const access = dest.access[departureId];

  const courseIndex = Math.floor(Math.random() * dest.modelCourses.length);
  const modelCourse = dest.modelCourses[courseIndex];

  // 距離★動的算出
  const multiplier = getRegionMultiplier(
    departure.region,
    dest.region
  );
  const estimatedHours =
    Math.round(dest.baseTravelHours * multiplier * 10) / 10;

  const dynamicDistanceLevel =
    calcDistanceLevel(estimatedHours);

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