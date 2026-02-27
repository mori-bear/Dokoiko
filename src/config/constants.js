export const DEPARTURES = ['東京', '大阪', '名古屋', '福岡', '札幌', '仙台', '広島', '高松'];

export const DISTANCE_LABELS = {
  1: '～1時間',
  2: '～2時間',
  3: '～4時間',
  4: '～6時間',
  5: '6時間以上',
};

/** 各出発地の交通属性。destinations.json と同じ形式で使用する。 */
export const DEPARTURE_CITY_INFO = {
  '東京':  { hasJR: true, hasAirport: true,  gateways: { rail: '東京',  air: 'TYO' } },
  '大阪':  { hasJR: true, hasAirport: true,  gateways: { rail: '大阪',  air: 'OSA' } },
  '名古屋': { hasJR: true, hasAirport: true,  gateways: { rail: '名古屋', air: 'NGO' } },
  '福岡':  { hasJR: true, hasAirport: true,  gateways: { rail: '博多',  air: 'FUK' } },
  '札幌':  { hasJR: true, hasAirport: true,  gateways: { rail: '札幌',  air: 'CTS' } },
  '仙台':  { hasJR: true, hasAirport: true,  gateways: { rail: '仙台',  air: 'SDJ' } },
  '広島':  { hasJR: true, hasAirport: true,  gateways: { rail: '広島',  air: 'HIJ' } },
  '高松':  { hasJR: true, hasAirport: true,  gateways: { rail: '高松',  air: 'TAK' } },
};

export const RAKUTEN_AFF_ID = '511c83ed.aa0fc172.511c83ee.51331b19';
