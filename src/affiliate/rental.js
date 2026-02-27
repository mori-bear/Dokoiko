/**
 * レンタカーリンク（じゃらん）
 */
export function buildRentalLinks(city) {
  const area = city.affiliate.rentalArea;
  if (!area) return [];

  return [
    {
      type: 'rental-jalan',
      label: 'じゃらんでレンタカーを探す',
      url: `https://www.jalan.net/rentacar/rl_search_list.do?salePlaceCode=${encodeURIComponent(area)}`,
    },
  ];
}
