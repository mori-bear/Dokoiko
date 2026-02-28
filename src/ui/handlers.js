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
      // 日帰りの場合 D4/D5 は無効
      if (state.stayType === 'daytrip' && parseInt(btn.dataset.value, 10) >= 4) return;
      setActive('[data-group="distance"]', btn);
      state.distanceLevel = parseInt(btn.dataset.value, 10);
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

  // 人数
  const peopleInput = document.getElementById('people-count');
  if (peopleInput) {
    peopleInput.value = state.people;
    peopleInput.addEventListener('change', (e) => {
      const v = parseInt(e.target.value, 10);
      if (v >= 1 && v <= 10) state.people = v;
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

/** 日帰り選択時に D4/D5 ボタンを無効化し、選択中なら解除 */
function updateDistanceButtons(stayType, state) {
  const isDaytrip = stayType === 'daytrip';
  document.querySelectorAll('[data-group="distance"]').forEach((btn) => {
    const dl = parseInt(btn.dataset.value, 10);
    if (isDaytrip && dl >= 4) {
      btn.classList.add('disabled');
      btn.setAttribute('aria-disabled', 'true');
      if (state.distanceLevel >= 4) {
        btn.classList.remove('active');
        state.distanceLevel = null;
      }
    } else {
      btn.classList.remove('disabled');
      btn.removeAttribute('aria-disabled');
    }
  });
}
