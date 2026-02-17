/**
 * 楽天アフィリエイトリンク自動生成
 * prefectureSlugから楽天トラベルのアフィリエイトURLを構築する
 */

import { RAKUTEN_AFFILIATE } from './config.js';

/**
 * 楽天トラベルで有効な都道府県スラッグ一覧
 * URLパスが正しいことを保証するためのホワイトリスト
 */
const VALID_PREFECTURE_SLUGS = new Set([
  'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
  'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
  'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano',
  'gifu', 'shizuoka', 'aichi', 'mie',
  'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
  'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
  'tokushima', 'kagawa', 'ehime', 'kochi',
  'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'
]);

/**
 * 都道府県スラッグから楽天アフィリエイトURLを生成
 * @param {string} prefectureSlug - 都道府県スラッグ（例: "kochi", "tokyo"）
 * @returns {string} アフィリエイトURL
 */
export function buildAffiliateUrl(prefectureSlug) {
  if (!prefectureSlug || typeof prefectureSlug !== 'string') {
    console.error('[Dokoiko] affiliate: prefectureSlugが不正:', prefectureSlug);
    return RAKUTEN_AFFILIATE.baseUrl;
  }

  const slug = prefectureSlug.toLowerCase().trim();

  if (!VALID_PREFECTURE_SLUGS.has(slug)) {
    console.warn('[Dokoiko] affiliate: 未知のスラッグ:', slug);
  }

  const targetUrl = `${RAKUTEN_AFFILIATE.travelUrlBase}${slug}/`;
  const affiliateUrl = `${RAKUTEN_AFFILIATE.baseUrl}?${RAKUTEN_AFFILIATE.paramKey}=${encodeURIComponent(targetUrl)}`;

  console.log('[Dokoiko] affiliate:', {
    slug,
    targetUrl,
    affiliateUrl
  });

  return affiliateUrl;
}
