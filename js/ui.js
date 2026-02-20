/**
 * UI描画モジュール
 * DOM操作とレンダリングを担当
 */

import { buildAffiliateUrl } from './affiliate.js';
import { THEME_LABELS } from './config.js';

/**
 * レベル値(1〜5)を★☆で表示
 */
function renderStars(level, max = 5) {
  const filled = Math.max(0, Math.min(max, level));
  return '<span aria-hidden="true">' +
    '<span class="star--filled">★</span>'.repeat(filled) +
    '<span class="star--empty">☆</span>'.repeat(max - filled) +
    '</span>' +
    `<span class="sr-only">${filled}/${max}</span>`;
}

/** フォールバック時メッセージ */
const RELAXED_MESSAGES = {
  theme: '条件に完全一致するプランがなかったため、テーマを広げて提案しています。',
  distance: '条件に完全一致するプランがなかったため、距離の条件を広げて提案しています。',
  both: '条件に完全一致するプランがなかったため、条件を広げて提案しています。'
};

/**
 * 出発地セレクト描画
 */
export function renderDepartures(selectEl, departures) {
  selectEl.innerHTML = departures
    .map(d => `<option value="${d.id}">${d.label}（${d.region}）</option>`)
    .join('');
}

/**
 * テーマタグ生成
 */
function renderThemeTags(themes) {
  return themes
    .map(t => `<span class="tag tag--${t}">${THEME_LABELS[t] || t}</span>`)
    .join('');
}

/**
 * プラン描画（改良版）
 */
export function renderResult(container, plan) {

  const { destination, access, modelCourse, candidateCount, relaxed } = plan;

  // ⭐ アフィURL生成
  let affiliateUrl = "#";
  try {
    affiliateUrl = buildAffiliateUrl(destination.prefectureSlug);
  } catch (e) {
    console.error("[Dokoiko] affiliate生成失敗:", e);
  }

  console.log("[Dokoiko] 最終アフィURL:", affiliateUrl);

  const relaxedBanner = relaxed
    ? `<div class="relaxed-banner">${RELAXED_MESSAGES[relaxed]}</div>`
    : '';

  container.innerHTML = `
    <div class="result-card" role="article">
      ${relaxedBanner}

      <div class="result-header">
        <div>
          <h2 class="result-city">${destination.city}</h2>
          <span class="result-prefecture">${destination.prefecture}</span>
        </div>
        <div class="result-tags">
          ${renderThemeTags(destination.themes)}
        </div>
      </div>

      <p class="result-description">${destination.description}</p>

      <div class="level-row">
        <span class="level-item"><span class="level-label">難易度</span>${renderStars(destination.difficulty)}</span>
        <span class="level-item"><span class="level-label">距離</span>${renderStars(destination.distanceLevel)}</span>
        <span class="level-item"><span class="level-label">予算</span>${renderStars(destination.budgetLevel)}</span>
      </div>

      <div class="result-section">
        <h3 class="section-title">アクセス</h3>
        <div class="access-card">
          <div class="access-row">
            <span class="access-label">行き</span>
            <span>${access.outbound}</span>
          </div>
          <div class="access-row">
            <span class="access-label">帰り</span>
            <span>${access.return}</span>
          </div>

          <div class="access-meta">
            <span>⏱ ${access.time}</span>
            <span>💰 ${access.price}</span>
            <span>💳 IC：${access.ic}</span>
          </div>
        </div>
      </div>

      <div class="result-section">
        <h3 class="section-title">モデルコース</h3>
        <p>${modelCourse}</p>
      </div>

      <!-- 楽天アフィボタン -->
      <a 
        href="${affiliateUrl}" 
        target="_blank" 
        rel="nofollow sponsored noopener" 
        class="cta-btn"
      >
        この街の宿を楽天で探す
      </a>

      <button type="button" class="retry-btn" id="retry-btn">
        ほかのプランを見る
        ${candidateCount > 1 ? `（あと${candidateCount - 1}件）` : ''}
      </button>
    </div>
  `;

  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 該当なし
 */
export function renderEmpty(container) {
  container.innerHTML = `
    <div class="result-card result-card--empty">
      <p>
        この条件に合うプランが見つかりませんでした。<br>
        条件を変えてもう一度お試しください。
      </p>
    </div>
  `;
  container.style.display = 'block';
}

/**
 * エラー
 */
export function renderError(container, message) {
  container.innerHTML = `
    <div class="result-card result-card--error">
      <p>${message}</p>
    </div>
  `;
  container.style.display = 'block';
}

/**
 * ローディング
 */
export function renderLoading(container) {
  container.innerHTML = `
    <div class="result-card result-card--loading">
      <p>プランを探しています...</p>
    </div>
  `;
  container.style.display = 'block';
}
