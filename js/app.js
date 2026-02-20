/**
 * メインアプリケーション
 * 各モジュールを統合し、イベントハンドリングを行う
 */

import { loadDepartures, loadDestinations } from './dataLoader.js';
import { generatePlan, resetHistory } from './planGenerator.js';
import {
  renderDepartures,
  renderResult,
  renderEmpty,
  renderError,
  renderLoading
} from './ui.js';

let departures = [];
let destinations = [];

const $ = (id) => document.getElementById(id);

async function init() {
  const generateBtn = $('generate-btn');
  const resultContainer = $('result');
  const departureSelect = $('departure');

  // 出発日にデフォルト値（今日）をセット
  const depDateInput = $('dep-date');
  if (depDateInput && !depDateInput.value) {
    const today = new Date();
    depDateInput.value = today.toISOString().slice(0, 10);
  }

  try {
    [departures, destinations] = await Promise.all([
      loadDepartures(),
      loadDestinations()
    ]);

    renderDepartures(departureSelect, departures);
    generateBtn.disabled = false;
    generateBtn.textContent = 'プランを提案してもらう';
  } catch (err) {
    console.error('[Dokoiko] 初期化エラー:', err);
    renderError(resultContainer, 'データの読み込みに失敗しました。ページをリロードしてください。');
    return;
  }

  // 出発地変更時に履歴をリセット
  departureSelect.addEventListener('change', () => {
    resetHistory();
    resultContainer.style.display = 'none';
  });

  // 提案ボタン
  generateBtn.addEventListener('click', handleGenerate);

  // 「ほかのプランを見る」ボタン（動的要素なのでイベント委譲）
  resultContainer.addEventListener('click', (e) => {
    if (e.target.id === 'retry-btn') {
      handleGenerate();
    }
  });
}

function handleGenerate() {
  const departureId = $('departure').value;
  const departure = departures.find(d => d.id === departureId);
  const distance = $('distance').value;
  const theme = $('theme').value;
  const stay = $('stay').value;
  const resultContainer = $('result');

  // 日時取得（未入力は現在日時）
  const now = new Date();
  const depDate = $('dep-date').value || now.toISOString().slice(0, 10);
  const depTime = $('dep-time').value || now.toTimeString().slice(0, 5);

  const plan = generatePlan(destinations, departure, distance, theme, stay);

  if (plan) {
    plan.depDate = depDate;
    plan.depTime = depTime;
    renderResult(resultContainer, plan);
  } else {
    renderEmpty(resultContainer);
  }
}

document.addEventListener('DOMContentLoaded', init);
