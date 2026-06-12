# いわしん製作プロジェクト — CLAUDE.md

> Claude Codeがこのプロジェクトを把握するための指示書です。
> 作業開始前に必ずこのファイルを読んでください。

---

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | いわしん製作プロジェクト |
| ジャンル | メイドインワリオ風 5秒ミニゲーム集 |
| テーマ | いわき信用組合（いわしん）第三者委員会報告書をモチーフにしたシュール・コミカルなゲーム |
| エンジン | Phaser.js 3.x |
| 言語 | JavaScript (ES Modules) |
| ターゲット | ブラウザ（PC・スマホ）/ iPhone（Capacitorラッピング） |
| 配布 | 無料・Web公開 |

---

## フォルダ構成

```
iwashin-game/
├── CLAUDE.md               ← このファイル
├── index.html
├── package.json
├── capacitor.config.json   ← iPhone化用
├── mock/                   ← HTMLモック置き場（MG実装前の動作確認用）
│   ├── mg03_committee.html
│   └── ...（MGごとのモック）
├── src/
│   ├── main.js             ← Phaser初期化・シーン登録
│   ├── GameManager.js      ← 進行管理（シングルトン）
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── LobbyScene.js
│   │   ├── ResultScene.js
│   │   └── minigames/
│   │       ├── MG01_SNSFire.js
│   │       ├── MG02_Independence.js
│   │       ├── MG03_Committee.js
│   │       └── ...（MG04〜MG60）
│   └── common/
│       ├── MiniGameBase.js   ← 全MG継承元（必ず使うこと）
│       ├── Timer5s.js        ← 5秒タイマーUI
│       └── InputHandler.js   ← PC/スマホ統合入力
└── assets/
    ├── images/
    └── audio/
```

> **モックについて**
> `mock/mg{ID}_{name}.html` に対応する HTML モックがある場合は、MG実装時に必ずそのモックを参照すること。
> ビジュアルデザイン・演出・ゲームロジックのベースとして使う。

---

## アーキテクチャの鉄則

### 1. 全MGはMiniGameBase.jsを継承すること

```javascript
import MiniGameBase from '../../common/MiniGameBase.js';

export default class MG01_SNSFire extends MiniGameBase {
  constructor() {
    super({ key: 'MG01_SNSFire' });
  }

  create() {
    super.create(); // タイマー・UI初期化
    // ゲーム固有の処理
  }

  // 時間切れ時の処理（必ずオーバーライド）
  onTimeUp() {
    this.endGame(false);
  }
}
```

### 2. 入力は必ずInputHandler.jsを使うこと

PC（クリック・キーボード）とスマホ（タッチ）を統一的に扱うため、
直接 `this.input.on('pointerdown', ...)` を書かず、InputHandlerを経由すること。

```javascript
// NG
this.input.on('pointerdown', handler);

// OK
this.inputHandler.onClick(handler);
this.inputHandler.onSwipe('left', handler);
```

### 3. ハードコードOK、Inspectorなし

座標・サイズ・色は定数としてファイル内に直書きする。
外部設定ファイルへの切り出しは後回しでよい。

---

## ゲーム全体仕様

| 項目 | 内容 |
|------|------|
| 通常ゲーム時間 | 5秒 |
| ボス時間 | 60秒〜120秒（各ボス仕様参照） |
| 進行方式 | 通常MGをランダム順でプレイ → 全クリアでボス解放 |
| 失敗時 | 次のランダムMGへ進む |
| UI共通 | タイマー表示・SUCCESS/FAILED画面（ResultScene） |
| 画面サイズ | 390×844（iPhone基準）、PC時はアスペクト維持でスケール |

---

## 操作設計（PC / スマホ対応表）

| アクション | PC | スマホ |
|-----------|-----|--------|
| クリック/タップ | マウスクリック | タップ |
| 移動（WASD） | WASDキー | 画面スワイプ or バーチャルパッド |
| ドラッグ | マウスドラッグ | タッチドラッグ |
| 連打 | クリック連打 | タップ連打 |
| 選択 | クリック | タップ |

---

## 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| シーンファイル | `MG{2桁ID}_{英語名}.js` | `MG01_SNSFire.js` |
| シーンキー | ファイル名と同一 | `'MG01_SNSFire'` |
| 定数 | UPPER_SNAKE_CASE | `GAME_DURATION = 5` |
| メソッド | camelCase | `spawnEnemy()` |

---

## 全ミニゲーム一覧（60本 + ボス10本）

### 第1編：第三者委員会の概要

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG01 | SNS火種を消せ！ | クリック | 該当投稿（2つ以上）を全削除 | 時間切れ |
| MG02 | 独立性を守れ！ | 移動（WASD/スワイプ） | 5秒間当たらず生き残る | 役職員に1回でも接触 |
| MG03 | 委員会メンバーを揃えろ！ | クリック選択 | 正しいメンバーを2人以上選ぶ | 利害関係者を1人でも選ぶ |
| MG04 | 内部調査をすり抜けろ！ | 移動 | ライトを避けて通過 | ライトに照らされる |
| MG05 | SNS投稿を発見せよ！ | タップ | 猫画像に紛れた不祥事投稿を発見 | 時間切れ |
| MG06 | ミーティングを開催せよ！ | ドラッグ | 3人の委員を中央に集める | 時間切れ |
| MG07 | 影響力を排除せよ！ | クリック/弾く | "影響力"の文字を全て弾き返す | 時間切れ |
| BOSS1 | 独立性ディフェンス | WASD/スワイプで盾操作 | 30秒生き残る | HP=0 |

### 第2編：組織体制・管理体制

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG08 | 朝会に遅れるな！ | 連打/移動 | 8:45までに到着 | 時間切れ |
| MG09 | 常務会を突破せよ！ | 移動 | 役員の隙間を通り抜ける | 役員に接触 |
| MG10 | 職務分掌を押し付けろ！ | ドラッグ | 業務カードを他部署へ全移動 | 時間切れ |
| MG11 | ガバナンスを整えろ！ | パズル | 理事会・監事会・常務会を正配置 | 時間切れ |
| MG12 | 朝会議題を選別せよ！ | タップ | 重要議題だけ選ぶ | 不要な議題を選ぶ |
| MG13 | 非公式ミーティングを探せ！ | クリック | ドアを開けて怪しい会議を発見 | 時間切れ |
| MG14 | 議事録を作成せよ！ | 並べ替え | キーワードを正しい順に並べる | 時間切れ/誤順序 |
| BOSS2 | 朝会パニック・マネジメント | ドラッグ振り分け | ガバナンス崩壊前に処理 | ゲージMAX |

### 第3編：調査妨害・隠蔽

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG15 | ノートPCを守れ！ | 移動 | ハンマーから逃げ切る | PCが壊される |
| MG16 | 資料を隠すな！ | クリック救出 | シュレッダー前に資料救出 | 資料がシュレッダーへ |
| MG17 | 虚偽説明を見破れ！ | 選択 | 3つから正しい説明を選ぶ | 誤選択 |
| MG18 | バックアップを探せ！ | クリック | 棚から正しいHDDを選択 | 誤選択/時間切れ |
| MG19 | 影響力を排除せよ！ | 移動回避 | 役員影を避ける | 接触 |
| MG20 | 証拠を提出せよ！ | ドラッグ | 指定の資料だけ提出 | 誤提出/時間切れ |
| MG21 | 記憶違いを回避せよ！ | 移動回避 | "記憶にない"吹き出しを避ける | 接触 |
| BOSS3 | 資料隠滅チェイス | 移動・収集 | HDDを規定数集める | ハンマー接触/時間切れ |

### 第4編：不正融資の金額特定

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG22 | 無断借名を見破れ！ | 選択 | 3つの名義から怪しいものを選ぶ | 誤選択 |
| MG23 | 償却を止めろ！ | タップ連打 | 減り続ける貸出金を止める | 0になる |
| MG24 | 不自然な取引をタップせよ！ | 高速タップ | 口座履歴から不正取引を抽出 | 見逃し/誤タップ |
| MG25 | 名義を集めろ！ | タップ | 多数から指定名義だけ選ぶ | 誤選択 |
| MG26 | 利息を計算せよ！ | 選択 | （どれを選んでも外れる演出） | 全て失敗 |
| MG27 | データ解析を急げ！ | キャッチ | 降ってくる数字から指定のものをキャッチ | 時間切れ |
| MG28 | 償却済みを避けろ！ | 移動回避 | "償却済み"スタンプを避ける | 接触 |
| BOSS4 | 無断借名・全件特定チャレンジ | 高速タップ | 一定数抽出 | 見逃しすぎ/誤タップ超過 |

### 第5編：不正融資の経緯

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG29 | 迂回ルートをつなげ！ | 線つなぎ | A→B→C→X1社へ線をつなぐ | 誤接続/時間切れ |
| MG30 | ペーパーカンパニーを見つけろ！ | 選択 | ペラペラの紙会社を選ぶ | 誤選択 |
| MG31 | 資金を届けろ！ | 操作 | 封筒を障害物を避けて運ぶ | 障害物に接触 |
| MG32 | 返済を先延ばしせよ！ | 連打 | 書換ボタンを連打 | 連打不足 |
| MG33 | 名義を借りろ！ | タップ | 名義を差し出す人だけタップ | 誤タップ |
| MG34 | 実態を確認せよ！ | クリック調査 | 空っぽならOUT表示 | 実態ありを誤認 |
| BOSS5 | 迂回ルート構築シミュレーター | 線つなぎ | 正しいルート完成 | 誤接続/時間切れ |

### 第6編：原因分析

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG35 | 上意下達を避けろ！ | 移動回避 | 上から降る矢印を避ける | 接触 |
| MG36 | パワハラを回避せよ！ | 移動回避 | 巨大吹き出しを避ける | 接触 |
| MG37 | 風通しを良くせよ！ | クリック | 全ての窓を開ける | 時間切れ |
| MG38 | 内部統制を整えろ！ | 並べ替え | チェックリストを正しい順に並べる | 誤順序 |
| MG39 | 組織文化を変えろ！ | ドラッグ | 古い看板を新しい看板に差し替える | 時間切れ |
| MG40 | 沈黙を破れ！ | クリック連打 | "沈黙の壁"を破壊する | 時間切れ |
| BOSS6 | 組織風土ブレイクダウン | 複合操作 | 風通しゲージMAX | 時間切れ |

### 第7編：法令問題

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG41 | 文書偽造を止めろ！ | クリック阻止 | 勝手に押される印鑑を止める | 押される |
| MG42 | 届出を提出せよ！ | ドラッグ | 書類を正しい窓口へ提出 | 誤提出/時間切れ |
| MG43 | 背任を回避せよ！ | 押し返し | 危険なボタンを押す手を押し返す | ボタンが押される |
| MG44 | 証拠を守れ！ | キャッチ | 落ちてくる証拠をキャッチ | 取り逃し |
| MG45 | 法令を選べ！ | 選択 | 3つの法令から正しいものを選ぶ | 誤選択 |
| BOSS7 | 法令コンプライアンス裁判ショー | 選択対応 | 規定数対応 | 誤対応超過/時間切れ |

### 第8編：再発防止策

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG46 | 内部通報をキャッチせよ！ | ドラッグ | 吹き出しを正しい窓口へドラッグ | 誤送/時間切れ |
| MG47 | 外部監査を招け！ | 誘導 | 会計士を会議室に誘導 | 時間切れ |
| MG48 | 組織改革を進めろ！ | スワイプ | 古い役職者をスワイプで退任 | 時間切れ |
| MG49 | 風土改善！ | こする | 画面のホコリを全て落とす | 時間切れ |
| MG50 | 透明性を上げろ！ | こする | 曇ったガラスを磨いて透明にする | 時間切れ |
| BOSS8 | 組織改革タワーバトル | 物理積み上げ | 一定の高さまで積む | 崩れる/時間切れ |

### 第9編：再発防止ロードマップ

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG51 | 内部統制を強化せよ！ | 並べ替え | チェック項目を正しい順に並べる | 誤順序 |
| MG52 | 透明性を上げろ！ | こする | 黒塗り資料をこすって開示 | 時間切れ |
| MG53 | 役員退任を進めろ！ | ドラッグ | 古い役員を退任席へ移動 | 時間切れ |
| MG54 | 改善策を選べ！ | 選択 | 3つの改善策から正しいものを選ぶ | 誤選択 |
| MG55 | ロードマップを完成させろ！ | パズル | ピースを全て正しく配置 | 時間切れ |
| BOSS9 | 再発防止ロードマップ・ランナー | 横スクロール | 一定数アイテム収集 | 障害物接触/時間切れ |

### 第10編：真相究明

| ID | タイトル | 操作 | 成功条件 | 失敗条件 |
|----|---------|------|---------|---------|
| MG56 | 記憶違いを見破れ！ | 選択 | 3つの説明から矛盾しているものを選ぶ | 誤選択 |
| MG57 | 資料を提出せよ！ | ドラッグ | 散らばった資料から指定のものを提出 | 誤提出/時間切れ |
| MG58 | 説明責任を果たせ！ | 選択 | 質問カードを正しく選ぶ | 誤選択 |
| MG59 | かわしセリフを避けろ！ | 移動回避 | 「記憶にない」吹き出しを避ける | 接触 |
| MG60 | 真相をつなげ！ | 線つなぎ | 断片的な情報を正しく線でつなぐ | 誤接続/時間切れ |
| BOSS10 | 真相究明・ラストインタビュー | 選択 | 真相ゲージMAX | 時間切れ |

---

## 実装状況

| ファイル | 状態 |
|---------|------|
| index.html | 実装済み |
| src/main.js | 実装済み |
| src/common/MiniGameBase.js | 実装済み |
| src/common/Timer5s.js | 実装済み |
| src/common/InputHandler.js | 実装済み |
| src/scenes/minigames/MG01_SNSFire.js | 実装済み |
| src/scenes/minigames/MG02_Independence.js | 実装済み |
| src/scenes/minigames/MG03_Committee.js | 実装済み（HTMLモック参照） |
| src/scenes/minigames/MG04_Infiltration.js | 実装済み |
| src/scenes/minigames/MG05_SNSSpy.js | 実装済み |
| src/scenes/minigames/MG06_Meeting.js | 実装済み |
| src/scenes/minigames/MG07_Influence.js | 実装済み |
| src/scenes/minigames/BOSS1_Independence.js | 実装済み |
| src/scenes/minigames/MG08_MorningRush.js | 実装済み |
| src/scenes/minigames/MG09_BoardBreak.js | 実装済み |
| src/scenes/minigames/MG10_DutyShift.js | 実装済み |
| src/scenes/minigames/MG11_Governance.js | 実装済み |
| src/scenes/minigames/MG12_Agenda.js | 実装済み |
| src/scenes/minigames/MG13_SecretDoor.js | 実装済み |
| src/scenes/minigames/MG14_Minutes.js | 実装済み |
| src/scenes/minigames/BOSS2_MorningPanic.js | 実装済み |
| src/scenes/minigames/MG15_PCGuard.js | 実装済み |
| src/scenes/minigames/MG16_DocRescue.js | 実装済み |
| src/scenes/minigames/MG17_TruthPick.js | 実装済み |
| src/scenes/minigames/MG18_HDDSearch.js | 実装済み |
| src/scenes/minigames/MG19_ShadowDodge.js | 実装済み |
| src/scenes/minigames/MG20_EvidenceSubmit.js | 実装済み |
| src/scenes/minigames/MG21_MemoryDodge.js | 実装済み |
| src/scenes/minigames/BOSS3_Chase.js | 実装済み |
| src/scenes/minigames/MG22_NameBorrow.js | 実装済み |
| src/scenes/minigames/MG23_WriteOff.js | 実装済み |
| src/scenes/minigames/MG24_Transaction.js | 実装済み |
| src/scenes/minigames/MG25_NameSelect.js | 実装済み |
| src/scenes/minigames/MG26_Interest.js | 実装済み |
| src/scenes/minigames/MG27_DataCatch.js | 実装済み |
| src/scenes/minigames/MG28_StampDodge.js | 実装済み |
| src/scenes/minigames/BOSS4_NameHunt.js | 実装済み |
| src/scenes/minigames/MG29_Route.js | 実装済み |
| src/scenes/minigames/MG30_PaperCompany.js | 実装済み |
| src/scenes/minigames/MG31_Envelope.js | 実装済み |
| src/scenes/minigames/MG32_Postpone.js | 実装済み |
| src/scenes/minigames/MG33_NameWilling.js | 実装済み |
| src/scenes/minigames/MG34_Investigation.js | 実装済み |
| src/scenes/minigames/BOSS5_RouteBuilder.js | 実装済み |
| src/scenes/minigames/MG35_ArrowDodge.js | 実装済み |
| src/scenes/minigames/MG36_BullDodge.js | 実装済み |
| src/scenes/minigames/MG37_Windows.js | 実装済み |
| src/scenes/minigames/MG38_Checklist.js | 実装済み |
| src/scenes/minigames/MG39_CultureChange.js | 実装済み |
| src/scenes/minigames/MG40_SilenceBreak.js | 実装済み |
| src/scenes/minigames/BOSS6_CultureBreakdown.js | 実装済み |
| src/scenes/minigames/MG41_StopStamp.js | 実装済み |
| src/scenes/minigames/MG42_Filing.js | 実装済み |
| src/scenes/minigames/MG43_Resistance.js | 実装済み |
| src/scenes/minigames/MG44_EvidenceCatch.js | 実装済み |
| src/scenes/minigames/MG45_LawSelect.js | 実装済み |
| src/scenes/minigames/BOSS7_Trial.js | 実装済み |
| src/scenes/minigames/MG46_Whistle.js | 実装済み |
| src/scenes/minigames/MG47_AuditGuide.js | 実装済み |
| src/scenes/minigames/MG48_SwipeOut.js | 実装済み |
| src/scenes/minigames/MG49_Dust.js | 実装済み |
| src/scenes/minigames/MG50_Glass.js | 実装済み |
| src/scenes/minigames/BOSS8_Tower.js | 実装済み |
| src/scenes/minigames/MG51_ControlOrder.js | 実装済み |
| src/scenes/minigames/MG52_Redact.js | 実装済み |
| src/scenes/minigames/MG53_Retire.js | 実装済み |
| src/scenes/minigames/MG54_BestPractice.js | 実装済み |
| src/scenes/minigames/MG55_Roadmap.js | 実装済み |
| src/scenes/minigames/BOSS9_Runner.js | 実装済み |
| src/scenes/minigames/MG56_Contradiction.js | 実装済み |
| src/scenes/minigames/MG57_DocFind.js | 実装済み |
| src/scenes/minigames/MG58_Account.js | 実装済み |
| src/scenes/minigames/MG59_EvasiveDodge.js | 実装済み |
| src/scenes/minigames/MG60_TruthConnect.js | 実装済み |
| src/scenes/minigames/BOSS10_Interview.js | 実装済み |

---

## 新しいMGを追加する手順

```
1. src/scenes/minigames/ にMG{ID}_{名前}.jsを作成
2. MiniGameBase.jsをimportして継承
3. create()でsuper.create()を呼び出す
4. onTimeUp()を必ずオーバーライドする
5. src/main.jsのscene配列に追加
6. GameManager.jsのMG_LISTにIDと設定を登録
7. このCLAUDE.mdの実装状況テーブルを更新
```

---

## よく使うClaude Codeへの指示例

```
# 新規MG作成
「MG05_SNSSpy.jsをMiniGameBaseを継承して作って。
 仕様：猫画像5枚に不祥事投稿1枚が混じる。タップで選択、正解でSUCCESS」

# 既存ファイル修正
「MG01_SNSFire.jsの投稿スポーン間隔を0.8秒から1.2秒に変更して」

# バグ修正
「InputHandler.jsのスワイプ検知が動かない。修正して」
```
