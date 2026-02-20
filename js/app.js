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
  const distance = $('distance').value;
  const theme = $('theme').value;
  const difficulty = $('difficulty').value;
  const resultContainer = $('result');

  const plan = generatePlan(destinations, departureId, distance, theme, difficulty);

  if (plan) {
    renderResult(resultContainer, plan);
  } else {
    renderEmpty(resultContainer);
  }
}

document.addEventListener('DOMContentLoaded', init);
