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

/** 出発地の地方 → JR予約サービスキー */
export const JR_REGION_MAP = {
  '北海道': 'ekinet',
  '東北':   'ekinet',
  '関東':   'ekinet',
  '中部':   'e5489',
  '近畿':   'e5489',
  '中国':   'e5489',
  '四国':   'e5489',
  '九州':   'jrkyushu',
};

/** EX予約対象エリア（東海道・山陽新幹線沿線） */
export const EX_REGIONS = ['関東', '中部', '近畿', '中国'];

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
