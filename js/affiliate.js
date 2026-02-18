import { RAKUTEN_AFFILIATE } from "./config.js";

/**
 * 有効な都道府県スラッグ一覧
 * travel.rakuten.co.jp/yado/{slug}/ に存在する英字表記
 */
const VALID_PREFECTURE_SLUGS = new Set([
  "hokkaido",
  "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima",
  "ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa",
  "niigata", "toyama", "ishikawa", "fukui",
  "yamanashi", "nagano",
  "gifu", "shizuoka", "aichi", "mie",
  "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama",
  "tottori", "shimane", "okayama", "hiroshima", "yamaguchi",
  "tokushima", "kagawa", "ehime", "kochi",
  "fukuoka", "saga", "nagasaki", "kumamoto", "oita",
  "miyazaki", "kagoshima", "okinawa"
]);

/**
 * 都道府県スラッグから楽天アフィリエイトURLを生成
 * @param {string} prefectureSlug 例: "kagawa", "tokyo"
 * @returns {string} 完全なアフィリエイトURL
 */
export function buildAffiliateUrl(prefectureSlug) {

  if (!prefectureSlug || typeof prefectureSlug !== "string") {
    console.error("[Dokoiko] affiliate: 無効なslug:", prefectureSlug);
    return RAKUTEN_AFFILIATE.baseUrl;
  }

  const slug = prefectureSlug.toLowerCase().trim();

  if (!VALID_PREFECTURE_SLUGS.has(slug)) {
    console.warn("[Dokoiko] 未知の都道府県slug:", slug);
  }

  // 楽天トラベルの対象URL
  const targetUrl = `${RAKUTEN_AFFILIATE.travelUrlBase}${slug}/`;

  // アフィリエイトURL生成
  const affiliateUrl =
    `${RAKUTEN_AFFILIATE.baseUrl}?` +
    `${RAKUTEN_AFFILIATE.paramKey}=${encodeURIComponent(targetUrl)}` +
    `&link_type=text`;

  console.log("[Dokoiko] affiliate生成:", affiliateUrl);

  return affiliateUrl;
}
