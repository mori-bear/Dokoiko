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

  // 予算ボタン
  document.querySelectorAll('[data-group="budget"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActive('[data-group="budget"]', btn);
      state.budgetLevel = parseInt(btn.dataset.value, 10);
    });
  });

  // 日付ボタン
  document.querySelectorAll('[data-group="date"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActive('[data-group="date"]', btn);
      const mode = btn.dataset.mode;
      const dateInput = document.getElementById('date-input');
      if (mode === 'today') {
        state.date = dateStr(0);
        dateInput.hidden = true;
      } else if (mode === 'tomorrow') {
        state.date = dateStr(1);
        dateInput.hidden = true;
      } else {
        dateInput.hidden = false;
      }
    });
  });

  // 日付カスタム入力
  document.getElementById('date-input').addEventListener('change', (e) => {
    if (e.target.value) state.date = e.target.value;
  });

  // 時刻
  document.getElementById('time-select').addEventListener('change', (e) => {
    state.time = e.target.value;
  });

  // GOボタン
  document.getElementById('go-btn').addEventListener('click', onGo);

  // リトライボタン
  document.getElementById('retry-btn').addEventListener('click', onRetry);
}

function setActive(selector, target) {
  document.querySelectorAll(selector).forEach((b) => b.classList.remove('active'));
  target.classList.add('active');
}

function dateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
