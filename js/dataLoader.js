/**
 * データ読み込みレイヤー
 * 現在はローカルJSONからfetch、将来的にAPI統合する際はこのファイルのみ変更すればよい
 */

import { DATA_PATH } from './config.js';

let cachedDepartures = null;
let cachedDestinations = null;

/**
 * 出発地一覧を取得
 * @returns {Promise<Array>} 出発地データの配列
 */
export async function loadDepartures() {
  if (cachedDepartures) return cachedDepartures;

  const res = await fetch(`${DATA_PATH}/departures.json`);
  if (!res.ok) throw new Error('出発地データの読み込みに失敗しました');
  cachedDepartures = await res.json();
  return cachedDepartures;
}

/**
 * 目的地一覧を取得
 * @returns {Promise<Array>} 目的地データの配列
 */
export async function loadDestinations() {
  if (cachedDestinations) return cachedDestinations;

  const res = await fetch(`${DATA_PATH}/destinations.json`);
  if (!res.ok) throw new Error('目的地データの読み込みに失敗しました');
  cachedDestinations = await res.json();
  return cachedDestinations;
}

/**
 * 将来のAPI統合用スタブ
 * ダイヤ情報をAPIから取得する際はこの関数を実装する
 * @param {string} from - 出発地ID
 * @param {string} to - 目的地ID
 * @returns {Promise<Object|null>} アクセス情報（未実装時はnull）
 */
export async function fetchScheduleFromAPI(from, to) {
  // TODO: 将来的に駅すぱあとAPI等と統合
  // const res = await fetch(`https://api.example.com/schedule?from=${from}&to=${to}`);
  // return await res.json();
  return null;
}
