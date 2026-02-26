/**
 * DOM描画
 * 縦導線: 出会い → 行き方 → 交通比較 → 現地移動 → 宿泊
 * renderResult: 抽選結果表示（drawブロック先頭）
 */

export function renderCityCards(destinations, onSelect) {
  const el = document.getElementById('city-cards');

  if (destinations.length === 0) {
    el.innerHTML = '<p class="empty-state">この距離の街は現在準備中です。</p>';
    return;
  }

  el.innerHTML = destinations
    .map(
      (d) => `
      <button class="city-card" data-id="${d.id}">
        <div class="city-card-info">
          <span class="city-card-pref">${d.prefecture}</span>
          <span class="city-card-name">${d.city}</span>
        </div>
        <div class="city-card-cta">プランを生成する</div>
      </button>
    `
    )
    .join('');

  el.querySelectorAll('.city-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.city-card').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      const dest = destinations.find((d) => d.id === btn.dataset.id);
      onSelect(dest);
    });
  });
}

/** 手動選択フロー用: 出会い → 行き方 → 交通比較 → 現地移動 → 宿泊 */
export function renderPlan(plan) {
  const el = document.getElementById('plan');
  if (!plan) {
    el.innerHTML = '';
    return;
  }
  const { destination, transitLinks, localItems, alternativeLinks, accommodationLinks } = plan;
  el.innerHTML = buildPlanBlocks(destination, transitLinks, localItems, alternativeLinks, accommodationLinks).join('');
}

/** 抽選フロー用: 結果発表 → 出会い → 行き方 → 交通比較 → 現地移動 → 宿泊 */
export function renderResult(plan) {
  const el = document.getElementById('plan');
  if (!plan) {
    el.innerHTML = '';
    return;
  }
  const { destination, transitLinks, localItems, alternativeLinks, accommodationLinks } = plan;
  const blocks = [
    buildDrawBlock(destination),
    ...buildPlanBlocks(destination, transitLinks, localItems, alternativeLinks, accommodationLinks),
  ];
  el.innerHTML = blocks.join('');
}

/* ── 共通ブロック組み立て ── */

function buildPlanBlocks(destination, transitLinks, localItems, alternativeLinks, accommodationLinks) {
  const blocks = [buildMeetBlock(destination)];

  if (transitLinks.length > 0) {
    blocks.push(buildTransitBlock(transitLinks));
  }

  if (alternativeLinks.length > 0) {
    blocks.push(buildAlternativeBlock(alternativeLinks));
  }

  if (localItems.length > 0) {
    blocks.push(buildLocalBlock(localItems));
  }

  if (accommodationLinks.length > 0) {
    blocks.push(buildAccBlock(accommodationLinks));
  }

  return blocks;
}

/* ── 個別ブロック生成 ── */

function buildDrawBlock(dest) {
  return `
    <section class="block block-draw" style="animation-delay:0ms">
      <p class="draw-label">あなたの次の旅先</p>
      <h2 class="draw-city">${dest.city}</h2>
      <p class="draw-pref">${dest.prefecture}&ensp;·&ensp;${dest.region}</p>
    </section>
  `;
}

function buildMeetBlock(dest) {
  const highlightHtml =
    dest.highlights.length > 0
      ? `<ul class="highlights">
           ${dest.highlights
             .slice(0, 3)
             .map((h) =>
               h.url
                 ? `<li><a href="${h.url}" target="_blank" rel="noopener noreferrer">${h.name}</a></li>`
                 : `<li>${h.name}</li>`
             )
             .join('')}
         </ul>`
      : '';

  return `
    <section class="block block-meet" style="animation-delay:0ms">
      <div class="block-eyebrow">出会い</div>
      <div class="appeal">
        ${dest.appeal.map((line) => `<p>${line}</p>`).join('')}
      </div>
      <h2 class="meet-city">${dest.city}</h2>
      <p class="meet-pref">${dest.prefecture}&ensp;·&ensp;${dest.region}</p>
      ${highlightHtml}
    </section>
  `;
}

function buildTransitBlock(links) {
  const linkHtml = links
    .map((l) =>
      l.url
        ? `<a href="${l.url}" target="_blank" rel="noopener noreferrer"
               class="link-btn link-${l.type}">${l.label}</a>`
        : `<p class="local-text">${l.label}</p>`
    )
    .join('');

  return `
    <section class="block block-transit" style="animation-delay:80ms">
      <div class="block-eyebrow">行き方</div>
      <div class="link-stack">
        ${linkHtml}
      </div>
    </section>
  `;
}

function buildAlternativeBlock(links) {
  const html = links
    .map(
      (l) =>
        `<a href="${l.url}" target="_blank" rel="noopener noreferrer"
            class="link-btn link-${l.type}">${l.label}</a>`
    )
    .join('');

  return `
    <section class="block block-alt" style="animation-delay:120ms">
      <div class="block-eyebrow">交通比較</div>
      <div class="link-stack">${html}</div>
    </section>
  `;
}

function buildLocalBlock(items) {
  const html = items
    .map((item) =>
      item.url
        ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer"
               class="link-btn link-${item.type}">${item.label}</a>`
        : `<p class="local-text">${item.label}</p>`
    )
    .join('');

  return `
    <section class="block block-local" style="animation-delay:160ms">
      <div class="block-eyebrow">現地移動</div>
      <div class="link-stack">${html}</div>
    </section>
  `;
}

function buildAccBlock(links) {
  return `
    <section class="block block-acc" style="animation-delay:240ms">
      <div class="block-eyebrow">宿泊</div>
      <div class="link-stack link-stack-row">
        ${links
          .map(
            (l) =>
              `<a href="${l.url}" target="_blank" rel="noopener noreferrer"
                  class="link-btn link-${l.type}">${l.label}</a>`
          )
          .join('')}
      </div>
    </section>
  `;
}
