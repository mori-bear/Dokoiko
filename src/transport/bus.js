/**
 * 高速バス 比較サイトリンク
 */
export function buildBusLink(city) {
  if (!city.transport.bus) return null;

  return {
    type: 'bus',
    label: '高速バスで比較する',
    url: 'https://www.bushikaku.net/',
  };
}
