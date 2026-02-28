import { selectDestination } from './src/engine/selectionEngine.js';
import { resolveTransportLinks } from './src/transport/transportRenderer.js';
import { buildHotelLinks } from './src/affiliate/hotel.js';
import { renderResult } from './src/ui/render.js';
import { bindHandlers } from './src/ui/handlers.js';
import { DISTANCE_LABELS } from './src/config/constants.js';

const state = {
  destinations: [],
  departure: '東京',
  distance: null,
  stayType: null,      // 'daytrip' | '1night'
  datetime: buildDefaultDatetime(),
  people: '1',
};

async function init() {
  try {
    const res = await fetch('./src/data/destinations.json');
    if (!res.ok) throw new Error('データ読み込み失敗');
    state.destinations = await res.json();
  } catch {
    const btn = document.getElementById('go-btn');
    btn.disabled = true;
    btn.textContent = 'データ読み込み失敗';
    return;
  }

  bindHandlers(state, go, retry);
}

function go() {
  if (state.distance === null) {
    showFormError('距離を選んでください。');
    return;
  }
  if (state.stayType === null) {
    showFormError('日帰り・宿泊を選んでください。');
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
    state.distance,
    state.stayType
  );

  const transportLinks = resolveTransportLinks(city, state.departure);
  const hotelLinks = buildHotelLinks(city, state.datetime?.split('T')[0], state.stayType);

  renderResult({
    city,
    transportLinks,
    hotelLinks,
    distanceLabel: DISTANCE_LABELS[state.distance],
  });

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

/** 現在時刻 + 30分 を datetime-local 形式で返す */
function buildDefaultDatetime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

init();
