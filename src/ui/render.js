/**
 * DOM描画モジュール
 *
 * 表示順:
 *   1. 都市ブロック（空気感3行）
 *   2. 交通ブロック
 *   3. 宿泊ブロック（目的地 / ハブ / 両方）
 *   4. なし（レンタカーは交通ブロック内に含む）
 */

export function renderResult({ city, transportLinks, hotelLinks, distanceLabel }) {
  const hasDestHotel = hotelLinks.destination.length > 0;
  const hasHubHotel = hotelLinks.hub.length > 0;
  const isLast = !hasDestHotel && !hasHubHotel;

  const el = document.getElementById('result-inner');
  el.innerHTML = [
    buildCityBlock(city, distanceLabel),
    buildTransportBlock(transportLinks, isLast),
    hasDestHotel ? buildHotelBlock(hotelLinks.destination, city.name, !hasHubHotel) : '',
    hasHubHotel ? buildHotelBlock(hotelLinks.hub, 'ハブ拠点', true) : '',
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

  const typeBadge = buildTypeBadge(city.type);

  return `
    <div class="city-block">
      <div class="city-header">
        <h2 class="city-name">${city.name}</h2>
        <p class="city-sub">${city.prefecture}　${city.region}${typeBadge}</p>
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

function buildTypeBadge(type) {
  const labels = {
    onsen: '♨ 温泉',
    island: '🏝 島',
    rural: '🌿 自然',
    town: '🏘 町',
    city: '',
  };
  const label = labels[type] || '';
  if (!label) return '';
  return `　<span class="type-badge type-${type}">${label}</span>`;
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

function buildHotelBlock(links, areaLabel, isLast) {
  const lastClass = isLast ? ' result-block-last' : '';
  const linksHtml = links.map((link) => buildLinkItem(link)).join('');
  return `
    <div class="result-block${lastClass}">
      <div class="block-label">宿泊 — ${areaLabel}</div>
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
