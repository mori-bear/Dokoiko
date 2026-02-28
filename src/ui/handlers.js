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
      if (btn.classList.contains('hidden')) return;
      setActive('[data-group="distance"]', btn);
      state.distance = parseInt(btn.dataset.value, 10);
    });
  });

  // 日帰り / 1泊2日 ボタン
  document.querySelectorAll('[data-group="stay"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActive('[data-group="stay"]', btn);
      state.stayType = btn.dataset.value;
      updateDistanceButtons(state.stayType, state);
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

  // 人数ボタン
  document.querySelectorAll('[data-group="people"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActive('[data-group="people"]', btn);
      state.people = btn.dataset.value;
    });
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

/** 日帰り選択時は D4/D5 を非表示にし、選択中なら解除 */
function updateDistanceButtons(stayType, state) {
  const isDaytrip = stayType === 'daytrip';
  document.querySelectorAll('[data-group="distance"]').forEach((btn) => {
    const dl = parseInt(btn.dataset.value, 10);
    if (isDaytrip && dl >= 4) {
      btn.classList.add('hidden');
      if (state.distance >= 4) {
        btn.classList.remove('active');
        state.distance = null;
      }
    } else {
      btn.classList.remove('hidden');
    }
  });
}
