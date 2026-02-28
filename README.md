# どこいこ 5.0

> 目的地が主役。ハブは裏方。交通と宿は統一ロジックで管理。

---

## 思想

距離と日程だけで未知の街と出会い、そのまま予約完了まで。

目的地はつねに1都市のみ。選択肢は距離（1〜5）・日程（日帰り/1泊2日）・出発日時・人数のみ。ポエム禁止、実用重視。

---

## 起動

```sh
npx serve .
```

`http://localhost:3000` を開く。
※ `fetch` を使用するため `file://` 直接開きでは動かない。

---

## ディレクトリ構成

```
src/config/constants.js           出発地情報・ラベル・アフィリエイトID
src/engine/selectionEngine.js     抽選ロジック（departure + DL → 1件）
src/transport/transportRenderer.js 交通リンクアセンブラ
src/transport/linkBuilder.js      Yahoo/JR/Skyscanner/GoogleMaps/Ferry/Rental
src/affiliate/hotel.js            宿泊リンク（楽天・じゃらん・じゃらんレンタカー）
src/data/destinations.json        90都市（新構造）
src/ui/render.js                  DOM描画（都市→交通→宿泊）
src/ui/handlers.js                イベントバインド
pages/about.html / privacy.html / disclaimer.html
index.html / style.css / app.js
```

---

## destinations.json フィールド仕様

| フィールド | 型 | 説明 |
|---|---|---|
| id | string | 一意のID（出発地suffix付き） |
| name | string | 都市名 |
| prefecture | string | 都道府県 |
| region | string | 地方 |
| departures | string[] | 対象出発地 |
| distanceLevel | 1〜5 | 遠さ（1=近い, 5=遠い） |
| type | city/town/rural/onsen/island | 目的地の性格 |
| stayPolicy | destination/hub/both | 宿泊先の方針 |
| transportHubs | { rail?, air?, ferry?, bus? } | 利用可能な交通手段 |
| railCompany | east/central_west_shikoku/kyushu/null | JR予約サービス分岐 |
| themes | string[3] | テーマタグ |
| staySupport | string[] | daytrip / 1night |
| appeal | string[3] | 空気感3行 |
| affiliate | { hotelArea } | 宿泊検索エリア名 |

---

## 交通ロジック

### 表示順

1. **鉄道** — Yahoo乗換 + JR予約（railCompany分岐）
2. **航空** — Skyscanner比較 + Googleマップ（出発地→空港）
3. **高速バス** — Googleマップ（日時反映）
4. **フェリー** — Google検索（港名）
5. **レンタカー** — じゃらん（航空・フェリー・island・rural時）

### railCompany 分岐

| 値 | サービス |
|---|---|
| east | えきねっと（JR東日本） |
| central_west_shikoku | e5489（JR西日本・四国） |
| kyushu | 九州ネット予約（JR九州） |
| null | 鉄道なし |

---

## 宿泊ロジック（stayPolicy）

| 値 | 表示 |
|---|---|
| destination | 目的地の宿のみ |
| hub | ハブ都市の宿のみ |
| both | 目的地 + ハブ 両方 |

stayType === 'daytrip' の場合は宿泊リンクを表示しない。

---

## 特殊処理

- 沖縄県目的地: railCompany = null（鉄道なし）
- type = "onsen": stayPolicy = "destination"
- type = "island": stayPolicy = "both"
- 日帰り時: distanceLevel 4・5 を除外

---

## アフィリエイトID

| サービス | 場所 |
|---|---|
| 楽天トラベル | src/config/constants.js: RAKUTEN_AFF_ID |
