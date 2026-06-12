// GameManager.js - 全体進行管理

class GameManagerClass {
  constructor() {
    // プレイ済みMGの記録（全体）
    this.playedMGs = new Set();
    // 現チャプターのプレイ済みMG
    this.chapterPlayedMGs = new Set();
    // 現在のチャプター番号
    this.currentChapter = 1;
    // 現在のスコア（成功数）
    this.successCount = 0;
    this.failCount = 0;
    // 直前のゲーム結果
    this.lastResult = null;
    // 直前のMGキー
    this.lastMGKey = null;
    // テストモードフラグ（TestModeSceneからの起動時にtrue）
    this.testMode = false;
  }

  // チャプターデータ
  static CHAPTER_DATA = [
    { num: 1,  title: '第三者委員会の概要',   subtitle: 'SNS投稿・独立性・内部調査',       colorHex: '#2c5f8a', color: 0x2c5f8a, boss: 'BOSS1_Independence' },
    { num: 2,  title: '組織体制・管理体制',   subtitle: '朝会・常務会・職務分掌',           colorHex: '#3a7d44', color: 0x3a7d44, boss: 'BOSS2_MorningPanic' },
    { num: 3,  title: '調査妨害・隠蔽',       subtitle: 'PC・資料・証拠の保護',             colorHex: '#8a2c2c', color: 0x8a2c2c, boss: 'BOSS3_Chase' },
    { num: 4,  title: '不正融資の金額特定',   subtitle: '名義・償却・データ解析',           colorHex: '#7a4a9a', color: 0x7a4a9a, boss: 'BOSS4_NameHunt' },
    { num: 5,  title: '不正融資の経緯',       subtitle: '迂回・ペーパー会社・封筒',         colorHex: '#8a6a2c', color: 0x8a6a2c, boss: 'BOSS5_RouteBuilder' },
    { num: 6,  title: '原因分析',             subtitle: '上意下達・パワハラ・組織文化',     colorHex: '#2c7a7a', color: 0x2c7a7a, boss: 'BOSS6_CultureBreakdown' },
    { num: 7,  title: '法令問題',             subtitle: '偽造・届出・背任・法令',           colorHex: '#8a4a2c', color: 0x8a4a2c, boss: 'BOSS7_Trial' },
    { num: 8,  title: '再発防止策',           subtitle: '内部通報・外部監査・組織改革',     colorHex: '#2c4a8a', color: 0x2c4a8a, boss: 'BOSS8_Tower' },
    { num: 9,  title: '再発防止ロードマップ', subtitle: '内部統制・役員退任・ロードマップ', colorHex: '#5a7a2c', color: 0x5a7a2c, boss: 'BOSS9_Runner' },
    { num: 10, title: '真相究明',             subtitle: '記憶・資料・説明責任・真相',       colorHex: '#8a2c6a', color: 0x8a2c6a, boss: 'BOSS10_Interview' },
  ];

  // 利用可能なミニゲーム一覧
  // 新規MG追加時はここに登録すること
  static MG_LIST = [
    { key: 'MG01_SNSFire',      title: 'SNS火種を消せ！',         chapter: 1 },
    { key: 'MG02_Independence',  title: '独立性を守れ！',           chapter: 1 },
    { key: 'MG03_Committee',     title: '委員会メンバーを揃えろ！', chapter: 1 },
    { key: 'MG04_Infiltration',  title: '内部調査をすり抜けろ！',   chapter: 1 },
    { key: 'MG05_SNSSpy',        title: 'SNS投稿を発見せよ！',     chapter: 1 },
    { key: 'MG06_Meeting',       title: 'ミーティングを開催せよ！', chapter: 1 },
    { key: 'MG07_Influence',     title: '影響力を排除せよ！',       chapter: 1 },
    { key: 'MG08_MorningRush',   title: '朝会に遅れるな！',         chapter: 2 },
    { key: 'MG09_BoardBreak',    title: '常務会を突破せよ！',       chapter: 2 },
    { key: 'MG10_DutyShift',     title: '職務分掌を押し付けろ！',   chapter: 2 },
    { key: 'MG11_Governance',    title: 'ガバナンスを整えろ！',     chapter: 2 },
    { key: 'MG12_Agenda',        title: '朝会議題を選別せよ！',     chapter: 2 },
    { key: 'MG13_SecretDoor',    title: '非公式ミーティングを探せ！', chapter: 2 },
    { key: 'MG14_Minutes',       title: '議事録を作成せよ！',       chapter: 2 },
    { key: 'MG15_PCGuard',       title: 'ノートPCを守れ！',         chapter: 3 },
    { key: 'MG16_DocRescue',     title: '資料を隠すな！',           chapter: 3 },
    { key: 'MG17_TruthPick',     title: '虚偽説明を見破れ！',       chapter: 3 },
    { key: 'MG18_HDDSearch',     title: 'バックアップを探せ！',     chapter: 3 },
    { key: 'MG19_ShadowDodge',   title: '影響力を排除せよ！',       chapter: 3 },
    { key: 'MG20_EvidenceSubmit',title: '証拠を提出せよ！',         chapter: 3 },
    { key: 'MG21_MemoryDodge',   title: '記憶違いを回避せよ！',     chapter: 3 },
    { key: 'MG22_NameBorrow',    title: '無断借名を見破れ！',       chapter: 4 },
    { key: 'MG23_WriteOff',      title: '償却を止めろ！',           chapter: 4 },
    { key: 'MG24_Transaction',   title: '不自然な取引をタップせよ！', chapter: 4 },
    { key: 'MG25_NameSelect',    title: '名義を集めろ！',           chapter: 4 },
    { key: 'MG26_Interest',      title: '利息を計算せよ！',         chapter: 4 },
    { key: 'MG27_DataCatch',     title: 'データ解析を急げ！',       chapter: 4 },
    { key: 'MG28_StampDodge',    title: '償却済みを避けろ！',       chapter: 4 },
    { key: 'MG29_Route',         title: '迂回ルートをつなげ！',     chapter: 5 },
    { key: 'MG30_PaperCompany',  title: 'ペーパーカンパニーを見つけろ！', chapter: 5 },
    { key: 'MG31_Envelope',      title: '資金を届けろ！',           chapter: 5 },
    { key: 'MG32_Postpone',      title: '返済を先延ばしせよ！',     chapter: 5 },
    { key: 'MG33_NameWilling',   title: '名義を借りろ！',           chapter: 5 },
    { key: 'MG34_Investigation', title: '実態を確認せよ！',         chapter: 5 },
    { key: 'MG35_ArrowDodge',    title: '上意下達を避けろ！',       chapter: 6 },
    { key: 'MG36_BullDodge',     title: 'パワハラを回避せよ！',     chapter: 6 },
    { key: 'MG37_Windows',       title: '風通しを良くせよ！',       chapter: 6 },
    { key: 'MG38_Checklist',     title: '内部統制を整えろ！',       chapter: 6 },
    { key: 'MG39_CultureChange', title: '組織文化を変えろ！',       chapter: 6 },
    { key: 'MG40_SilenceBreak',  title: '沈黙を破れ！',             chapter: 6 },
    { key: 'MG41_StopStamp',     title: '文書偽造を止めろ！',       chapter: 7 },
    { key: 'MG42_Filing',        title: '届出を提出せよ！',         chapter: 7 },
    { key: 'MG43_Resistance',    title: '背任を回避せよ！',         chapter: 7 },
    { key: 'MG44_EvidenceCatch', title: '証拠を守れ！',             chapter: 7 },
    { key: 'MG45_LawSelect',     title: '法令を選べ！',             chapter: 7 },
    { key: 'MG46_Whistle',       title: '内部通報をキャッチせよ！', chapter: 8 },
    { key: 'MG47_AuditGuide',    title: '外部監査を招け！',         chapter: 8 },
    { key: 'MG48_SwipeOut',      title: '組織改革を進めろ！',       chapter: 8 },
    { key: 'MG49_Dust',          title: '風土改善！',               chapter: 8 },
    { key: 'MG50_Glass',         title: '透明性を上げろ！',         chapter: 8 },
    { key: 'MG51_ControlOrder',  title: '内部統制を強化せよ！',     chapter: 9 },
    { key: 'MG52_Redact',        title: '透明性を上げろ！（黒塗り）', chapter: 9 },
    { key: 'MG53_Retire',        title: '役員退任を進めろ！',       chapter: 9 },
    { key: 'MG54_BestPractice',  title: '改善策を選べ！',           chapter: 9 },
    { key: 'MG55_Roadmap',       title: 'ロードマップを完成させろ！', chapter: 9 },
    { key: 'MG56_Contradiction', title: '記憶違いを見破れ！',       chapter: 10 },
    { key: 'MG57_DocFind',       title: '資料を提出せよ！',         chapter: 10 },
    { key: 'MG58_Account',       title: '説明責任を果たせ！',       chapter: 10 },
    { key: 'MG59_EvasiveDodge',  title: 'かわしセリフを避けろ！',   chapter: 10 },
    { key: 'MG60_TruthConnect',  title: '真相をつなげ！',           chapter: 10 },
  ];

  // CHAPTER_DATA へのアクセサ（インスタンスから呼べるように）
  getChapterData() {
    return GameManagerClass.CHAPTER_DATA;
  }

  // 指定チャプターのMG本数を返す
  getMGCountForChapter(chapter) {
    return GameManagerClass.MG_LIST.filter(mg => mg.chapter === chapter).length;
  }

  // チャプター開始
  startChapter(n) {
    this.currentChapter = n;
    this.chapterPlayedMGs = new Set();
  }

  // 現チャプターの未プレイMGをランダム選出（全完了時はnull）
  pickNextMGInChapter() {
    const chapterMGs = GameManagerClass.MG_LIST.filter(mg => mg.chapter === this.currentChapter);
    const unplayed = chapterMGs.filter(mg => !this.chapterPlayedMGs.has(mg.key));
    if (unplayed.length === 0) return null;
    const picked = Phaser.Utils.Array.GetRandom(unplayed);
    return picked;
  }

  // 現チャプターの全MGが完了しているか
  isChapterComplete() {
    const chapterMGs = GameManagerClass.MG_LIST.filter(mg => mg.chapter === this.currentChapter);
    return chapterMGs.every(mg => this.chapterPlayedMGs.has(mg.key));
  }

  // 現チャプターのボスシーンキーを返す
  getCurrentChapterBoss() {
    const chapter = GameManagerClass.CHAPTER_DATA.find(c => c.num === this.currentChapter);
    return chapter ? chapter.boss : null;
  }

  // 次にプレイするミニゲームをランダム選出（全体から）
  pickNextMG() {
    const candidates = GameManagerClass.MG_LIST.filter(
      mg => mg.key !== this.lastMGKey
    );
    const pool = candidates.length > 0 ? candidates : GameManagerClass.MG_LIST;
    const picked = Phaser.Utils.Array.GetRandom(pool);
    this.lastMGKey = picked.key;
    return picked;
  }

  // ゲーム結果を記録
  recordResult(mgKey, success) {
    this.playedMGs.add(mgKey);
    this.chapterPlayedMGs.add(mgKey);
    this.lastResult = { mgKey, success };
    if (success) this.successCount++;
    else this.failCount++;
  }

  // 進行状況をリセット
  reset() {
    this.playedMGs.clear();
    this.chapterPlayedMGs.clear();
    this.successCount = 0;
    this.failCount = 0;
    this.lastResult = null;
    this.lastMGKey = null;
    this.currentChapter = 1;
  }
}

// シングルトン
export const GameManager = new GameManagerClass();
