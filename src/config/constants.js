export const DEPARTURES = ['東京', '大阪', '名古屋', '福岡', '札幌', '仙台', '広島', '高松'];

export const DISTANCE_LABELS = {
  1: '～1時間',
  2: '～2時間',
  3: '～4時間',
  4: '～6時間',
  5: '6時間以上',
};

/** 各出発地の交通属性 */
export const DEPARTURE_CITY_INFO = {
  '東京':  { gateways: { rail: '東京駅',  air: 'TYO' } },
  '大阪':  { gateways: { rail: '大阪駅',  air: 'OSA' } },
  '名古屋': { gateways: { rail: '名古屋駅', air: 'NGO' } },
  '福岡':  { gateways: { rail: '博多駅',  air: 'FUK' } },
  '札幌':  { gateways: { rail: '札幌駅',  air: 'CTS' } },
  '仙台':  { gateways: { rail: '仙台駅',  air: 'SDJ' } },
  '広島':  { gateways: { rail: '広島駅',  air: 'HIJ' } },
  '高松':  { gateways: { rail: '高松駅',  air: 'TAK' } },
};

export const RAKUTEN_AFF_ID = '511c83ed.aa0fc172.511c83ee.51331b19';
