/**
 * DOM描画モジュール
 *
 * 表示順:
 *   1. カウンター（あとN件）
 *   2. 都市ブロック（アクセス行 + 空気感3行）
 *   3. 交通ブロック
 *   4. 宿泊ブロック（stayType=1night 時のみ）
 */

export function renderResult({ city, transportLinks, hotelLinks, distanceLabel, poolIndex, poolTotal }) {
  const hasDestHotel = hotelLinks.destination.length > 0;
  const hasHubHotel  = hotelLinks.hub.length > 0;
  const isLast = !hasDestHotel && !hasHubHotel;

  const el = document.getElementById('result-inner');
  el.innerHTML = [
    buildCounterBlock(poolIndex, poolTotal),
    buildCityBlock(city, distanceLabel),
    buildTransportBlock(transportLinks, isLast),
    hasDestHotel ? buildHotelBlock(hotelLinks.destination, city.name,  !hasHubHotel) : '',
    hasHubHotel  ? buildHotelBlock(hotelLinks.hub,         'ハブ拠点', true) : '',
  ].join('');
}

export function clearResult() {
  const el = document.getElementById('result-inner');
  if (el) el.innerHTML = '';
}

/* ── カウンター ── */

function buildCounterBlock(index, total) {
  const remaining = total - index - 1;
  const remainingText = remaining > 0
    ? `あと${remaining}件あります`
    : 'すべて表示しました';
  return `
    <div class="result-counter">
      <span>${remainingText}</span>
      <span>${index + 1} / ${total}</span>
    </div>
  `;
}

/* ── 都市ブロック ── */

function buildCityBlock(city, _distanceLabel) {
  const accessSentence = buildAccessSentence(city);

  const atmosphereHtml = (city.atmosphere || [])
    .map((line) => `<p class="appeal-line">${line}</p>`)
    .join('');

  const themesHtml = Array.isArray(city.themes) && city.themes.length
    ? city.themes.map((t) => `<span class="theme-tag">${t}</span>`).join('')
    : '';

  const categoryBadge = buildCategoryBadge(city.type);

  return `
    <div class="city-block">
      <div class="city-header">
        <h2 class="city-name">${city.name}</h2>
        <p class="city-sub">${city.region}${categoryBadge}</p>
      </div>
      ${accessSentence}
      ${themesHtml ? `<div class="themes-row">${themesHtml}</div>` : ''}
      <div class="city-appeal">${atmosphereHtml}</div>
    </div>
  `;
}

function buildAccessSentence(city) {
  const { access } = city;
  if (!access) return '';

  if (access.railGateway) {
    return `<p class="access-line">${access.railGateway}から、${access.railNote || 'アクセス可'}</p>`;
  }

  if (access.airportGateway) {
    return `<p class="access-line">${access.airportGateway}から移動可</p>`;
  }

  if (access.ferryGateway) {
    return `<p class="access-line">${access.ferryGateway}からフェリー</p>`;
  }

  return '';
}

function buildCategoryBadge(type) {
  if (type !== 'island') return '';
  return `　<span class="type-badge type-island">島</span>`;
}

/* ── 交通ブロック ── */

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

/* ── 宿泊ブロック ── */

function buildHotelBlock(links, areaLabel, isLast) {
  const lastClass = isLast ? ' result-block-last' : '';
  const label = areaLabel === 'ハブ拠点' ? '宿泊（近隣の拠点都市）' : '宿泊';
  const linksHtml = links.map((link) => buildLinkItem(link)).join('');
  return `
    <div class="result-block hotel-block${lastClass}">
      <div class="block-label">${label}</div>
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
