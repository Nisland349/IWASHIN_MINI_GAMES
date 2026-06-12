// TestModeScene.js - テストモード（MG個別選択プレイ）

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { GameManager } from '../GameManager.js';

const BOSS_LIST = [
  { key: 'BOSS1_Independence',     title: '独立性ディフェンス',             chapter: 1 },
  { key: 'BOSS2_MorningPanic',     title: '朝会パニック・マネジメント',     chapter: 2 },
  { key: 'BOSS3_Chase',            title: '資料隠滅チェイス',               chapter: 3 },
  { key: 'BOSS4_NameHunt',         title: '無断借名・全件特定チャレンジ',   chapter: 4 },
  { key: 'BOSS5_RouteBuilder',     title: '迂回ルート構築シミュレーター',   chapter: 5 },
  { key: 'BOSS6_CultureBreakdown', title: '組織風土ブレイクダウン',         chapter: 6 },
  { key: 'BOSS7_Trial',            title: '法令コンプライアンス裁判ショー', chapter: 7 },
  { key: 'BOSS8_Tower',            title: '組織改革タワーバトル',           chapter: 8 },
  { key: 'BOSS9_Runner',           title: '再発防止ロードマップ・ランナー', chapter: 9 },
  { key: 'BOSS10_Interview',       title: '真相究明・ラストインタビュー',   chapter: 10 },
];

export default class TestModeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestModeScene' });
  }

  init(data) {
    this._returnChapter = (data && data.chapter) ? data.chapter : 1;
  }

  create() {
    GameManager.testMode = true;
    this._launching = false;
    this.selectedChapter = 1;
    this.tabObjects = [];
    this.listObjects = [];
    this._buildStaticUI();
    this._selectChapter(this._returnChapter);
  }

  _buildStaticUI() {
    const W = GAME_WIDTH;

    this.add.rectangle(0, 0, W, GAME_HEIGHT, 0x0d1117).setOrigin(0);
    this.add.rectangle(0, 0, W, 50, 0x1a1a2e).setOrigin(0);

    this.add.text(W / 2, 25, 'テストモード', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffdd00',
    }).setOrigin(0.5);

    const backBtn = this.add.text(W - 12, 25, '← 戻る', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#aaaaaa',
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
    backBtn.on('pointerout',  () => backBtn.setColor('#aaaaaa'));
    backBtn.on('pointerdown', () => {
      GameManager.testMode = false;
      this.scene.start('TitleScene');
    });

    // チャプタータブ（2行 × 5列）
    const TAB_W = W / 5;
    const TAB_H = 36;

    this.tabObjects = [];
    for (let i = 0; i < 10; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const cx = col * TAB_W + TAB_W / 2;
      const cy = 50 + row * TAB_H + TAB_H / 2;
      const chNum = i + 1;

      const bg = this.add.rectangle(cx, cy, TAB_W - 2, TAB_H - 2, 0x2a2a4e)
        .setInteractive({ useHandCursor: true });

      const label = this.add.text(cx, cy, `第${chNum}編`, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#aaaacc',
      }).setOrigin(0.5);

      bg.on('pointerdown', () => this._selectChapter(chNum));

      this.tabObjects.push({ bg, label, chapter: chNum });
    }
  }

  _selectChapter(chapterNum) {
    this.selectedChapter = chapterNum;
    const chapterData = GameManager.getChapterData().find(c => c.num === chapterNum);

    for (const tab of this.tabObjects) {
      const sel = tab.chapter === chapterNum;
      tab.bg.setFillStyle(sel ? (chapterData ? chapterData.color : 0x3a5f8a) : 0x2a2a4e);
      tab.label.setColor(sel ? '#ffffff' : '#aaaacc');
    }

    this._renderList(chapterNum, chapterData);
  }

  _renderList(chapterNum, chapterData) {
    for (const obj of this.listObjects) obj.destroy();
    this.listObjects = [];
    this._launching = false;

    const W = GAME_WIDTH;
    const LIST_TOP = 50 + 36 * 2 + 4;
    const ROW_H = 58;
    const PAD = 8;
    const accentColor = chapterData ? chapterData.color : 0x3a5f8a;

    // チャプタータイトルバー
    const titleBarBg = this.add.rectangle(0, LIST_TOP, W, 32, accentColor, 0.8).setOrigin(0);
    const titleBarText = this.add.text(W / 2, LIST_TOP + 16,
      `第${chapterNum}編：${chapterData ? chapterData.title : ''}`, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#ffffff',
      }).setOrigin(0.5);
    this.listObjects.push(titleBarBg, titleBarText);

    const MG_LIST = GameManager.constructor.MG_LIST;
    const chapterMGs = MG_LIST.filter(mg => mg.chapter === chapterNum);
    const boss = BOSS_LIST.find(b => b.chapter === chapterNum);

    let y = LIST_TOP + 36;

    for (const mg of chapterMGs) {
      const objs = this._renderRow(mg.key, mg.title, y, ROW_H, W, PAD, accentColor, false);
      this.listObjects.push(...objs);
      y += ROW_H + 2;
    }

    if (boss) {
      const objs = this._renderRow(boss.key, `BOSS: ${boss.title}`, y, ROW_H, W, PAD, 0xcc4400, true);
      this.listObjects.push(...objs);
    }
  }

  _renderRow(key, title, y, rowH, W, pad, accentColor, isBoss) {
    const bgColor = isBoss ? 0x2a1000 : 0x1a1a2e;

    const bg = this.add.rectangle(pad, y, W - pad * 2, rowH, bgColor)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    const border = this.add.rectangle(pad, y, 4, rowH, accentColor).setOrigin(0);

    const keyLabel = this.add.text(pad + 10, y + rowH * 0.28, key, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: isBoss ? '#ff8844' : '#7799aa',
    }).setOrigin(0, 0.5);

    const titleLabel = this.add.text(pad + 10, y + rowH * 0.68, title, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: isBoss ? 'bold' : 'normal',
      color: isBoss ? '#ffaa66' : '#ffffff',
      wordWrap: { width: W - pad * 2 - 64 },
    }).setOrigin(0, 0.5);

    const playBtnBg = this.add.rectangle(W - pad - 4, y + rowH / 2, 52, 30, accentColor)
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    const playBtnText = this.add.text(W - pad - 30, y + rowH / 2, 'PLAY', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    const launch = () => this._launchMG(key);
    bg.on('pointerdown', launch);
    playBtnBg.on('pointerdown', launch);

    bg.on('pointerover', () => bg.setFillStyle(isBoss ? 0x3a1800 : 0x252545));
    bg.on('pointerout',  () => bg.setFillStyle(bgColor));

    return [bg, border, keyLabel, titleLabel, playBtnBg, playBtnText];
  }

  _launchMG(key) {
    if (this._launching) return;
    this._launching = true;

    const MG_LIST = GameManager.constructor.MG_LIST;
    const mg = MG_LIST.find(m => m.key === key);
    if (mg) {
      GameManager.currentChapter = mg.chapter;
    } else {
      const boss = BOSS_LIST.find(b => b.key === key);
      if (boss) GameManager.currentChapter = boss.chapter;
    }

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(key);
    });
    this.cameras.main.fadeOut(200, 0, 0, 0);
  }
}
