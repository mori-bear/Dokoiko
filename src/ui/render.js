/**
 * DOM描画モジュール
 * 縦導線: 都市 → 交通 → 宿泊 → 体験
 */

export function renderResult({ city, transportLinks, hotelLinks, rentalLinks, experienceLinks }) {
  const el = document.getElementById('result-inner');
  el.innerHTML = [
    buildCityBlock(city),
    buildTransportBlock(transportLinks),
    buildHotelBlock(hotelLinks),
    buildExperienceBlock(experienceLinks, rentalLinks),
  ].join('');
}

export function clearResult() {
  const el = document.getElementById('result-inner');
  if (el) el.innerHTML = '';
}

/* ── 各ブロック ── */

function buildCityBlock(city) {
  const { name, reading, prefecture, region, mainStation } = city.basic;
  const experienceHtml = city.experience
    .map((line) => `<p class="experience-line">${line}</p>`)
    .join('');

  return `
    <div class="city-block">
      <div class="city-header">
        <span class="city-reading">${reading}</span>
        <h2 class="city-name">${name}</h2>
        <p class="city-meta">${prefecture}　${region}　${mainStation}</p>
      </div>
      <div class="city-experience">
        ${experienceHtml}
      </div>
    </div>
  `;
}

function buildTransportBlock(links) {
  const linksHtml = links
    .map((link) => buildLinkItem(link))
    .join('');

  return `
    <div class="result-block">
      <div class="block-label">交通</div>
      <div class="link-list">
        ${linksHtml}
      </div>
      <p class="transport-note">※ 一部列車は窓口購入のみの場合があります。運賃・時刻は公式サイトでご確認ください。</p>
    </div>
  `;
}

function buildHotelBlock(links) {
  const linksHtml = links
    .map((link) => buildLinkItem(link))
    .join('');

  return `
    <div class="result-block">
      <div class="block-label">宿泊</div>
      <div class="link-list">
        ${linksHtml}
      </div>
    </div>
  `;
}

function buildExperienceBlock(expLinks, rentalLinks) {
  const allLinks = [...rentalLinks, ...expLinks];
  const linksHtml = allLinks
    .map((link) => buildLinkItem(link))
    .join('');

  return `
    <div class="result-block">
      <div class="block-label">体験・移動手段</div>
      <div class="link-list">
        ${linksHtml}
      </div>
    </div>
  `;
}

function buildLinkItem(link) {
  if (!link.url) {
    return `<span class="link-item link-nourl link-${link.type}">${link.label}</span>`;
  }
  const noteHtml = link.note
    ? `<span class="link-note">${link.note}</span>`
    : '';
  return `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer"
       class="link-item link-${link.type}">
      ${link.label}
      ${noteHtml}
    </a>
  `;
}
