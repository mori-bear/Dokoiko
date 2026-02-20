/**
 * UIレンダリング管理
 */

const $ = (id) => document.getElementById(id);

/* ===============================
   出発地セレクト描画
================================ */
export function renderDepartures(selectEl, departures) {
  selectEl.innerHTML = departures
    .map(d => `<option value="${d.id}">${d.label}</option>`)
    .join('');
}


/* ===============================
   結果表示
================================ */
export function renderResult(container, plan) {
  container.style.display = 'block';

  const { destination, access, modelCourse } = plan;

  // ===== タグ生成 =====
  const tags = destination.themes.map(t => {
    const label =
      t === 'view' ? '景色' :
      t === 'food' ? 'グルメ' :
      t === 'experience' ? '体験' : t;

    return `<span class="tag tag--${t}">${label}</span>`;
  }).join('');

  // ===== 星表示 =====
  const renderStars = (level) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="${i <= level ? 'star--filled' : 'star--empty'}">★</span>`;
    }
    return stars;
  };

  // ===== 交通ボタン =====
  let transportButtons = '';

  if (access?.jrType === 'jr-east') {
    transportButtons += `
      <a href="https://www.eki-net.com/" target="_blank"
         class="suggest-btn suggest-btn--ekinet">
         えきねっと
      </a>
    `;
  }

  if (access?.jrType === 'jr-west') {
    transportButtons += `
      <a href="https://www.jr-odekake.net/goyoyaku/e5489/" target="_blank"
         class="suggest-btn suggest-btn--e5489">
         e5489
      </a>
    `;
  }

  if (access?.jrType === 'jr-central') {
    transportButtons += `
      <a href="https://expy.jp/" target="_blank"
         class="suggest-btn suggest-btn--ex">
         EX予約
      </a>
    `;
  }

  // Yahooは常に表示
  if (access?.yahooUrl) {
    transportButtons += `
      <a href="${access.yahooUrl}" target="_blank"
         class="suggest-btn suggest-btn--yahoo">
         Yahoo!乗換案内
      </a>
    `;
  }

  const transportSection = `
    <div class="suggest-btns">
      ${transportButtons}
    </div>
  `;

  // ===== 楽天 =====
  const rakutenBtn = `
    <a href="https://travel.rakuten.co.jp/"
       target="_blank"
       class="cta-btn">
       この街の宿を楽天で探す
    </a>
  `;

  // ===== 他のプランボタン =====
  const retryBtn = `
    <button id="retry-btn" class="retry-btn">
      ほかのプランを見る
    </button>
  `;

  // ===== 描画 =====
  container.innerHTML = `
    <div class="result-card">

      <div class="result-header">
        <div>
          <h2 class="result-city">${destination.city}</h2>
          <div class="result-prefecture">${destination.prefecture}</div>
        </div>
        <div class="result-tags">${tags}</div>
      </div>

      <p class="result-description">
        ${destination.description}
      </p>

      <div class="level-row">
        <div class="level-item">
          <span class="level-label">距離</span>
          ${renderStars(plan.dynamicDistanceLevel)}
          <span class="level-sub">
            （推定片道 約${plan.estimatedHours}時間）
          </span>
        </div>
        <div class="level-item">
          <span class="level-label">予算</span>
          ${renderStars(destination.budget)}
        </div>
      </div>

      ${transportSection}
      ${rakutenBtn}
      ${retryBtn}

    </div>
  `;
}


/* ===============================
   空表示
================================ */
export function renderEmpty(container) {
  container.style.display = 'block';
  container.innerHTML = `
    <div class="result-card result-card--empty">
      <p class="empty-message">
        条件に合うプランが見つかりませんでした。
      </p>
    </div>
  `;
}


/* ===============================
   エラー表示
================================ */
export function renderError(container, message) {
  container.style.display = 'block';
  container.innerHTML = `
    <div class="result-card result-card--error">
      <p class="error-message">${message}</p>
    </div>
  `;
}


/* ===============================
   ローディング表示
================================ */
export function renderLoading(container) {
  container.style.display = 'block';
  container.innerHTML = `
    <div class="result-card result-card--loading">
      <div class="spinner"></div>
      <p>プランを考え中...</p>
    </div>
  `;
}