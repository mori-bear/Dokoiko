/**
 * 楽天アフィリエイトリンク自動生成
 * prefectureSlugから楽天トラベルのアフィリエイトURLを構築する
 */

import { RAKUTEN_AFFILIATE } from './config.js';

/**
 * 都道府県スラッグから楽天アフィリエイトURLを生成
 * @param {string} prefectureSlug - 都道府県スラッグ（例: "kochi", "tokyo"）
 * @returns {string} アフィリエイトURL
 */
export function buildAffiliateUrl(prefectureSlug) {
  const targetUrl = `${RAKUTEN_AFFILIATE.travelUrlBase}${prefectureSlug}/`;
  return `${RAKUTEN_AFFILIATE.baseUrl}?${RAKUTEN_AFFILIATE.paramKey}=${encodeURIComponent(targetUrl)}`;
}
