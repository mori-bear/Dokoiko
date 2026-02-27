import { selectDestination } from './src/engine/selectionEngine.js';
import { buildTransportLinks } from './src/transport/transportEngine.js';
import { buildHotelLinks } from './src/affiliate/hotel.js';
import { buildRentalLinks } from './src/affiliate/rental.js';
import { buildExperienceLinks } from './src/affiliate/experience.js';
import { renderResult, clearResult } from './src/ui/render.js';
import { bindHandlers } from './src/ui/handlers.js';

const state = {
  destinations: [],
  departure: '東京',
  distanceLevel: null,
  budgetLevel: null,
  date: dateStr(0),
  time: timeStr(),
};

async function init() {
  try {
    const res = await fetch('./src/data/destinations.json');
    if (!res.ok) throw new Error('データ読み込み失敗');
    state.destinations = await res.json();
  } catch {
    document.getElementById('go-btn').disabled = true;
    document.getElementById('go-btn').textContent = 'データ読み込み失敗';
    return;
  }

  populateTimeSelect();
  document.getElementById('date-input').value = state.date;
  bindHandlers(state, go, retry);
}

function go() {
  if (state.distanceLevel === null) {
    showFormError('距離を選んでください。');
    return;
  }
  if (state.budgetLevel === null) {
    showFormError('予算を選んでください。');
    return;
  }
  clearFormError();
  draw();
}

function retry() {
  draw();
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function draw() {
  const city = selectDestination(
    state.destinations,
    state.departure,
    state.distanceLevel,
    state.budgetLevel
  );

  const transportLinks = buildTransportLinks(city, state.departure, state.date, state.time);
  const hotelLinks = buildHotelLinks(city, state.date);
  const rentalLinks = buildRentalLinks(city);
  const experienceLinks = buildExperienceLinks(city);

  renderResult({ city, transportLinks, hotelLinks, rentalLinks, experienceLinks });

  const resultEl = document.getElementById('result');
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showFormError(msg) {
  const el = document.getElementById('form-error');
  if (el) { el.textContent = msg; el.hidden = false; }
}

function clearFormError() {
  const el = document.getElementById('form-error');
  if (el) { el.hidden = true; el.textContent = ''; }
}

function populateTimeSelect() {
  const sel = document.getElementById('time-select');
  const current = state.time.substring(0, 5);
  for (let h = 5; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      if (val === current) opt.selected = true;
      sel.appendChild(opt);
    }
  }
}

function dateStr(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function timeStr() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes() < 30 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}

init();
