/**
 * アプリケーション設定
 * 楽天アフィリエイトIDやデータパスなど、環境ごとの設定を一元管理
 */
export const RAKUTEN_AFFILIATE = {
  baseUrl: 'https://hb.afl.rakuten.co.jp/hgc/511c83ed.aa0fc172.511c83ee.51331b19/',
  paramKey: 'pc',
  travelUrlBase: 'https://travel.rakuten.co.jp/yado/'
};


export const DATA_PATH = './data';

export const THEME_LABELS = {
  view: '景色',
  food: 'グルメ',
  experience: '体験'
};

export const DISTANCE_LABELS = {
  near: '近場',
  far: '遠出'
};

export const DIFFICULTY_RANGES = {
  easy: [1, 2],
  normal: [3, 3],
  hard: [4, 5]
};

/** 8地方区分の隣接関係 */
export const REGION_ADJACENCY = {
  '北海道': ['東北'],
  '東北':   ['北海道', '関東'],
  '関東':   ['東北', '中部'],
  '中部':   ['関東', '近畿'],
  '近畿':   ['中部', '中国', '四国'],
  '中国':   ['近畿', '四国', '九州'],
  '四国':   ['近畿', '中国', '九州'],
  '九州':   ['中国', '四国'],
};

/** 地域倍率 */
export const REGION_MULTIPLIER = {
  same: 0.7,
  adjacent: 1.0,
  far: 1.3,
};

/**
 * 出発地と目的地の地域関係に基づく倍率を返す
 */
export function getRegionMultiplier(depRegion, destRegion) {
  if (depRegion === destRegion) return REGION_MULTIPLIER.same;
  const adj = REGION_ADJACENCY[depRegion];
  if (adj && adj.includes(destRegion)) return REGION_MULTIPLIER.adjacent;
  return REGION_MULTIPLIER.far;
}

/**
 * 推定所要時間から距離★(1〜5)を算出
 */
export function calcDistanceLevel(hours) {
  if (hours <= 1) return 1;
  if (hours <= 2) return 2;
  if (hours <= 3) return 3;
  if (hours <= 4) return 4;
  return 5;
}
