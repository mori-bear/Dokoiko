// 楽天アフィID（1回だけ入れる）
const RAKUTEN_BASE = "https://hb.afl.rakuten.co.jp/hgc/5113ee4b.8662cfc5.5113ee4c.119de89a/?pc=";

// 都市データ
const plans = [
{
  city: "高知市",
  prefectureUrl: "https://travel.rakuten.co.jp/yado/kochi/",
  access: {
    route: "高松7:12発 → 南風3号 → 高知9:43着",
    train: "特急南風",
    price: "約6,000円往復"
  },
  model: "桂浜 → ひろめ市場 → 高知城",
  distance: "far",
  theme: "view"
},
{
  city: "徳島市",
  prefectureUrl: "https://travel.rakuten.co.jp/yado/tokushima/",
  access: {
    route: "高松8:00発 → 徳島9:15着",
    train: "うずしお",
    price: "約3,000円往復"
  },
  model: "徳島ラーメン → 阿波踊り会館 → 眉山",
  distance: "near",
  theme: "food"
}
];
{
  city:"小豆島（土庄町）",
  prefectureUrl:"https://travel.rakuten.co.jp/yado/kagawa/",
  distance:"near",
  theme:"view",
  model:"エンジェルロード → オリーブ公園 → 海沿いカフェ",
  access:{
    takamatsu:{
      route:"高松港9:00 → フェリー → 土庄港10:00",
      time:"約1時間",
      price:"約1,400円往復",
      ic:"不可（現金のみ）"
    }
  }
}

