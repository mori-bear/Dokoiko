/**
 * UI描画モジュール
 * DOM操作とレンダリングを担当
 */

import { buildAffiliateUrl } from './affiliate.js';
import { THEME_LABELS, JR_REGION_MAP, EX_REGIONS } from './config.js';

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

/** JR予約・交通リンク定義（ブランドカラーはCSS class で指定） */
const JR_LINKS = {
  ekinet:   { label: 'えきねっと',       url: 'https://www.eki-net.com/',                   css: 'suggest-btn--ekinet' },
  e5489:    { label: 'e5489',            url: 'https://www.jr-odekake.net/goyoyaku/',       css: 'suggest-btn--e5489' },
  jrkyushu: { label: 'JR九州ネット予約',  url: 'https://www.jrkyushu.co.jp/train/reserve/', css: 'suggest-btn--jrkyushu' },
  ex:       { label: 'EX予約',           url: 'https://expy.jp/',                           css: 'suggest-btn--ex' },
};

/** Yahoo!乗換案内URLを組み立てる（date=YYYYMMDD&time=HHMM形式） */
function buildYahooTransitUrl(departureLabel, destCity, depDate, depTime) {
  const now = new Date();
  const dateStr = depDate || now.toISOString().slice(0, 10);
  const timeStr = depTime || now.toTimeString().slice(0, 5);
  const date = dateStr.replace(/-/g, '');
  const time = timeStr.replace(/:/g, '').slice(0, 4);
  const from = encodeURIComponent(departureLabel);
  const to = encodeURIComponent(destCity);
  return `https://transit.yahoo.co.jp/search/result?from=${from}&to=${to}&date=${date}&time=${time}&type=1&ticket=ic&shin=1`;
}

/** 交通・予約ボタン一覧を生成 */
function renderSuggestButtons(plan) {
  const { destination, departure, depDate, depTime, dynamicDistanceLevel } = plan;
  const btns = [];

  // Yahoo!乗換案内（常時）
  const yahooUrl = buildYahooTransitUrl(departure.label, destination.city, depDate, depTime);
  btns.push(`<a href="${yahooUrl}" target="_blank" rel="noopener" class="suggest-btn suggest-btn--yahoo">Yahoo!乗換案内</a>`);

  // EX予約: shinkansen かつ 東海道・山陽エリア同士の場合のみ
  if (destination.transportType === 'shinkansen' &&
      EX_REGIONS.includes(departure.region) &&
      EX_REGIONS.includes(destination.region)) {
    const link = JR_LINKS.ex;
    btns.push(`<a href="${link.url}" target="_blank" rel="noopener" class="suggest-btn ${link.css}">${link.label}</a>`);
  }

  // departure.region に応じたJR予約
  const jrKey = JR_REGION_MAP[departure.region];
  const jr = jrKey ? JR_LINKS[jrKey] : null;
  if (jr) {
    btns.push(`<a href="${jr.url}" target="_blank" rel="noopener" class="suggest-btn ${jr.css}">${jr.label}</a>`);
  }

  // 航空 or 距離★5 → スカイスキャナー
  if (destination.transportType === 'air' || dynamicDistanceLevel === 5) {
    btns.push(`<a href="https://www.skyscanner.jp/" target="_blank" rel="noopener" class="suggest-btn suggest-btn--sky">スカイスキャナー</a>`);
  }

  return btns.join('');
}

/**
 * プラン描画（改良版）
 */
export function renderResult(container, plan) {

  const { destination, modelCourse, candidateCount, relaxed,
          estimatedHours, dynamicDistanceLevel } = plan;

  // アフィURL生成
  let affiliateUrl = "#";
  try {
    affiliateUrl = buildAffiliateUrl(destination.prefectureSlug);
  } catch (e) {
    console.error("[Dokoiko] affiliate生成失敗:", e);
  }

  const relaxedBanner = relaxed
    ? `<div class="relaxed-banner">${RELAXED_MESSAGES[relaxed]}</div>`
    : '';

  // 距離表示：動的★＋推定片道時間
  const distanceStars = renderStars(dynamicDistanceLevel);
  const hoursText = `（推定片道 約${estimatedHours}時間）`;

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
        <span class="level-item"><span class="level-label">距離</span>${distanceStars}<span class="level-sub">${hoursText}</span></span>
        <span class="level-item"><span class="level-label">予算</span>${renderStars(destination.budgetLevel)}</span>
      </div>

      <div class="result-section">
        <h3 class="section-title">モデルコース</h3>
        <p>${modelCourse}</p>
      </div>

      <div class="suggest-btns">
        ${renderSuggestButtons(plan)}
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
