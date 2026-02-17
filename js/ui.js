/**
 * UI描画モジュール
 * DOM操作とレンダリングを担当
 */

import { buildAffiliateUrl } from './affiliate.js';
import { THEME_LABELS, DISTANCE_LABELS } from './config.js';

/** フォールバック時に表示するメッセージ */
const RELAXED_MESSAGES = {
  theme: '条件に完全一致するプランがなかったため、テーマを広げて提案しています。',
  distance: '条件に完全一致するプランがなかったため、距離の条件を広げて提案しています。',
  both: '条件に完全一致するプランがなかったため、条件を広げて提案しています。'
};

/**
 * 出発地セレクトボックスを描画
 */
export function renderDepartures(selectEl, departures) {
  selectEl.innerHTML = departures
    .map(d => `<option value="${d.id}">${d.label}（${d.region}）</option>`)
    .join('');
}

/**
 * テーマタグのHTML生成
 */
function renderThemeTags(themes) {
  return themes
    .map(t => `<span class="tag tag--${t}">${THEME_LABELS[t] || t}</span>`)
    .join('');
}

/**
 * プラン結果を描画
 */
export function renderResult(container, plan) {
  const { destination, access, modelCourse, candidateCount, relaxed } = plan;
  const affiliateUrl = buildAffiliateUrl(destination.prefectureSlug);

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
        <div class="result-tags">${renderThemeTags(destination.themes)}</div>
      </div>

      <p class="result-description">${destination.description}</p>

      <div class="result-section">
        <h3 class="section-title">アクセス</h3>
        <div class="access-card">
          <div class="access-row">
            <span class="access-label">行き</span>
            <span class="access-value">${access.outbound}</span>
          </div>
          <div class="access-row">
            <span class="access-label">帰り</span>
            <span class="access-value">${access.return}</span>
          </div>
          <div class="access-meta">
            <span class="meta-item">
              <span class="meta-icon" aria-hidden="true">&#x23F1;</span>
              ${access.time}
            </span>
            <span class="meta-item">
              <span class="meta-icon" aria-hidden="true">&#x1F4B0;</span>
              ${access.price}
            </span>
            <span class="meta-item">
              <span class="meta-icon" aria-hidden="true">&#x1F4B3;</span>
              IC：${access.ic}
            </span>
          </div>
        </div>
      </div>

      <div class="result-section">
        <h3 class="section-title">モデルコース</h3>
        <p class="model-course">${modelCourse}</p>
      </div>

      <a href="${affiliateUrl}" target="_blank" rel="noopener noreferrer" class="cta-btn">
        この街の宿を探す
      </a>

      <button type="button" class="retry-btn" id="retry-btn">
        ほかのプランを見る${candidateCount > 1 ? `（あと${candidateCount - 1}件）` : ''}
      </button>
    </div>
  `;

  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 該当なし表示
 */
export function renderEmpty(container) {
  container.innerHTML = `
    <div class="result-card result-card--empty">
      <p class="empty-message">
        この条件に合うプランが見つかりませんでした。<br>
        条件を変えてもう一度お試しください。
      </p>
    </div>
  `;
  container.style.display = 'block';
}

/**
 * エラー表示
 */
export function renderError(container, message) {
  container.innerHTML = `
    <div class="result-card result-card--error">
      <p class="error-message">${message}</p>
    </div>
  `;
  container.style.display = 'block';
}

/**
 * ローディング表示
 */
export function renderLoading(container) {
  container.innerHTML = `
    <div class="result-card result-card--loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>プランを探しています...</p>
    </div>
  `;
  container.style.display = 'block';
}
