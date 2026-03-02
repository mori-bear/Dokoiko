export function buildHotelLinks(city, date, stayType, people) {
  if (stayType !== '1night') {
    return { destination: [], hub: [] };
  }

  return {
    destination: [
      buildRakutenLink(city.name),
      buildJalanLink(city.name),
    ],
    hub: [],
  };
}

export function buildRakutenLink(cityName) {
  const encoded = encodeURIComponent(cityName);
  return {
    type: 'rakuten',
    label: '楽天でこの街の宿を見る',
    url: `https://www.google.com/search?q=${encoded}+楽天トラベル`,
  };
}

export function buildJalanLink(cityName) {
  const encoded = encodeURIComponent(cityName);
  return {
    type: 'jalan',
    label: 'じゃらんでこの街の宿を見る',
    url: `https://www.google.com/search?q=${encoded}+じゃらん`,
  };
}
