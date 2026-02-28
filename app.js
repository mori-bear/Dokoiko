import { buildPool } from './src/engine/selectionEngine.js';
import { resolveTransportLinks } from './src/transport/transportRenderer.js';
import { buildHotelLinks } from './src/affiliate/hotel.js';
import { renderResult } from './src/ui/render.js';
import { bindHandlers } from './src/ui/handlers.js';
import { DISTANCE_LABELS } from './src/config/constants.js';

const state = {
  destinations: [],
  departure:    '東京',
  distance:     null,
  stayType:     null,
  datetime:     buildDefaultDatetime(),
  people:       '1',
  pool:         [],
  poolIndex:    0,
};

async function init() {
  // イベントバインドは即時実行（データ読み込みを待たない）
  // これにより: ボタン反応・出発日時初期化が確実に行われる
  bindHandlers(state, go, retry);

  // destinations.json 読み込み
  try {
    const res = await fetch('./src/data/destinations.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.destinations = await res.json();
  } catch (err) {
    const btn = document.getElementById('go-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'データ読み込み失敗';
    }
  }
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
  if (state.destinations.length === 0) {
    showFormError('データを読み込み中です。しばらくお待ちください。');
    return;
  }
  clearFormError();

  state.pool      = buildPool(state.destinations, state.departure, state.distance, state.stayType);
  state.poolIndex = 0;
  draw();
}

function retry() {
  if (state.poolIndex >= state.pool.length - 1) {
    state.pool      = buildPool(state.destinations, state.departure, state.distance, state.stayType);
    state.poolIndex = 0;
  } else {
    state.poolIndex++;
  }
  draw();
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function draw() {
  const city = state.pool[state.poolIndex];
  if (!city) return;

  const transportLinks = resolveTransportLinks(city, state.departure);
  const hotelLinks     = buildHotelLinks(city, state.datetime?.split('T')[0], state.stayType);

  renderResult({
    city,
    transportLinks,
    hotelLinks,
    distanceLabel: DISTANCE_LABELS[state.distance],
    poolIndex:     state.poolIndex,
    poolTotal:     state.pool.length,
  });

  updateRetryBtn();

  const resultEl = document.getElementById('result');
  resultEl.hidden = false;
  if (state.poolIndex === 0) {
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateRetryBtn() {
  const btn = document.getElementById('retry-btn');
  if (!btn) return;
  const { pool, poolIndex } = state;
  if (poolIndex >= pool.length - 1) {
    btn.textContent = 'もう一度最初から引く';
  } else {
    btn.textContent = `引き直す（次は ${poolIndex + 2} / ${pool.length}）`;
  }
}

function showFormError(msg) {
  const el = document.getElementById('form-error');
  if (el) { el.textContent = msg; el.hidden = false; }
}

function clearFormError() {
  const el = document.getElementById('form-error');
  if (el) { el.hidden = true; el.textContent = ''; }
}

function buildDefaultDatetime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

init();
