# どこいこ 2.0

> 知らない街と出会い、納得して、予約まで。

---

## 思想

Dokoikoは交通検索サイトでも、宿比較サイトでもない。

**主役は「街との出会い」。**

距離感だけを手がかりに、知らない街を提示する。
その街の空気感を3行で伝え、行き方を"納得装置"として見せ、
宿は「背中を押す最後の一歩」として添える。

上から順に読めば予約まで完了できる縦導線が、唯一の設計原則。

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
core/planEngine.js        プラン生成 + 距離フィルタ
links/yahoo.js            Yahoo!路線情報 URL生成
links/rakuten.js          楽天トラベル アフィリエイトURL生成
links/jalan.js            じゃらん URL生成（アフィリエイト差し替え可）
ui/render.js              DOM描画（全ブロック）
data/destinations.json   目的地マスター
index.html
style.css
app.js                    状態管理・起動
```

---

## ユーザーフロー

```
① 距離（★1〜5）を選択
② 該当する街の一覧が表示される
③ 街を選ぶ
    ↓
  [ 出会いブロック  ] 都道府県・街名・appeal 3行・highlights
  [ 行き方ブロック  ] Yahoo乗換 / えきねっと（JRのみ）
  [ 現地移動ブロック] レンタカー / フェリー（該当する場合）
  [ 宿泊ブロック    ] 楽天トラベル / じゃらん（泊まり時のみ）
```

---

## destinations.json フィールド仕様

| フィールド | 型 | 説明 |
|---|---|---|
| id | string | 一意のID |
| city | string | 街名 |
| prefecture | string | 都道府県 |
| region | string | 地方 |
| mainStation | string | 主要駅（Yahoo URL の `to`）|
| railType | `"jr"` / `"private"` / `"none"` | 鉄道種別 |
| transportType | string[] | `rail` / `fly` / `drive` / `ferry` |
| distanceLevel | 1〜5 | 遠さ（1=近い, 5=遠い）|
| staySupport | string[] | `daytrip` / `1night` / `2night` |
| appeal | string[3] | 空気感を伝える3行 |
| highlights | `{name, url}`[] | 見どころ（最大3件）|
| departure.label | string | 出発駅（Yahoo URL の `from`）|

---

## 表示ルール

| 条件 | 表示 |
|---|---|
| `railType: "jr"` | Yahoo乗換 + えきねっとリンク |
| `railType: "private"` | Yahoo乗換のみ |
| `railType: "none"` | 鉄道導線なし |
| `transportType` に `"drive"` | レンタカー導線 |
| `transportType` に `"ferry"` | フェリー導線 |
| `stayType: "1night" / "2night"` | 楽天トラベル + じゃらんリンク |

---

## アフィリエイトID管理

| サービス | ファイル | 定数 |
|---|---|---|
| 楽天トラベル | `links/rakuten.js` | `RAKUTEN_AFF_ID` |
| じゃらん | `links/jalan.js` | `JALAN_AFF_ID` |
