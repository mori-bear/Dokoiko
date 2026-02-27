/**
 * DOM描画モジュール
 * 縦導線: 都市 → 交通 → 宿泊（1泊2日の場合のみ）
 */

export function renderResult({ city, transportLinks, hotelLinks, distanceLabel }) {
  const hasHotel = hotelLinks.length > 0;
  const el = document.getElementById('result-inner');
  el.innerHTML = [
    buildCityBlock(city, distanceLabel),
    buildTransportBlock(transportLinks, !hasHotel),
    hasHotel ? buildHotelBlock(hotelLinks) : '',
  ].join('');
}

export function clearResult() {
  const el = document.getElementById('result-inner');
  if (el) el.innerHTML = '';
}

/* ── 各ブロック ── */

function buildCityBlock(city, distanceLabel) {
  const appealHtml = city.appeal
    .map((line) => `<p class="appeal-line">${line}</p>`)
    .join('');

  const themesHtml = city.themes
    .map((t) => `<span class="theme-tag">${t}</span>`)
    .join('');

  const distanceMeta = distanceLabel
    ? `<span class="meta-label">距離</span><span class="meta-value">${distanceLabel}</span>`
    : '';

  return `
    <div class="city-block">
      <div class="city-header">
        <h2 class="city-name">${city.name}</h2>
        <p class="city-sub">${city.prefecture}　${city.region}</p>
      </div>
      <div class="city-meta-row">
        ${distanceMeta}
      </div>
      <div class="themes-row">${themesHtml}</div>
      <div class="city-appeal">
        ${appealHtml}
      </div>
    </div>
  `;
}

function buildTransportBlock(links, isLast) {
  const lastClass = isLast ? ' result-block-last' : '';
  const linksHtml = links.map((link) => buildLinkItem(link)).join('');
  return `
    <div class="result-block${lastClass}">
      <div class="block-label">交通</div>
      <div class="link-list">${linksHtml}</div>
    </div>
  `;
}

function buildHotelBlock(links) {
  const linksHtml = links.map((link) => buildLinkItem(link)).join('');
  return `
    <div class="result-block result-block-last">
      <div class="block-label">宿泊</div>
      <div class="link-list">${linksHtml}</div>
    </div>
  `;
}

function buildLinkItem(link) {
  return `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer"
       class="link-item link-${link.type}">
      ${link.label}
    </a>
  `;
}
