export function buildHotelLinks(city, date, stayType, people) {
  if (stayType !== '1night') {
    return { destination: [], hub: [] };
  }

  return {
    destination: [
      buildRakutenLink(),
      buildJalanLink(),
    ],
    hub: [],
  };
}

export function buildRakutenLink() {
  return {
    type: 'rakuten',
    label: '楽天トラベルで探す',
    url: 'https://travel.rakuten.co.jp/',
  };
}

export function buildJalanLink() {
  return {
    type: 'jalan',
    label: 'じゃらんで探す',
    url: 'https://www.jalan.net/',
  };
}
