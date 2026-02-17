/**
 * メインアプリケーション
 * 各モジュールを統合し、イベントハンドリングを行う
 */

import { loadDepartures, loadDestinations } from './dataLoader.js';
import { generatePlan } from './planGenerator.js';
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

  try {
    [departures, destinations] = await Promise.all([
      loadDepartures(),
      loadDestinations()
    ]);

    renderDepartures($('departure'), departures);
    generateBtn.disabled = false;
    generateBtn.textContent = 'プランを提案してもらう';
  } catch (err) {
    renderError(resultContainer, 'データの読み込みに失敗しました。ページをリロードしてください。');
    return;
  }

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
  const resultContainer = $('result');

  const plan = generatePlan(destinations, departureId, distance, theme);

  if (plan) {
    renderResult(resultContainer, plan);
  } else {
    renderEmpty(resultContainer);
  }
}

document.addEventListener('DOMContentLoaded', init);
