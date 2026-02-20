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

