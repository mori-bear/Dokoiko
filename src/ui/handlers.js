/**
 * イベントハンドラ
 */
export function bindHandlers(state, onGo, onRetry) {
  // 出発地
  document.getElementById('departure-select').addEventListener('change', (e) => {
    state.departure = e.target.value;
  });

  // 距離ボタン
  document.querySelectorAll('[data-group="distance"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActive('[data-group="distance"]', btn);
      state.distanceLevel = parseInt(btn.dataset.value, 10);
    });
  });

  // 日帰り / 1泊2日 ボタン
  document.querySelectorAll('[data-group="stay"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActive('[data-group="stay"]', btn);
      state.stayType = btn.dataset.value;
    });
  });

  // 出発日時
  const dtInput = document.getElementById('departure-dt');
  if (dtInput) {
    dtInput.value = state.datetime;
    dtInput.addEventListener('change', (e) => {
      if (e.target.value) state.datetime = e.target.value;
    });
  }

  // GOボタン
  document.getElementById('go-btn').addEventListener('click', onGo);

  // リトライボタン
  document.getElementById('retry-btn').addEventListener('click', onRetry);
}

function setActive(selector, target) {
  document.querySelectorAll(selector).forEach((b) => b.classList.remove('active'));
  target.classList.add('active');
}
