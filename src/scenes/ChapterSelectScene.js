// ChapterSelectScene.js - 章選択画面

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { GameManager } from '../GameManager.js';
import { ProgressManager } from '../ProgressManager.js';

// 章ごとのカラーバー色（Phaser数値）
const CHAPTER_COLORS = {
  1:  0x2c5f8a,
  2:  0x3a7d44,
  3:  0x8a2c2c,
  4:  0x7a4a9a,
  5:  0x8a6a2c,
  6:  0x2c7a7a,
  7:  0x8a4a2c,
  8:  0x2c4a8a,
  9:  0x5a7a2c,
  10: 0x8a2c6a,
};

export default class ChapterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterSelectScene' });
  }

  create() {
    // 背景
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf5f0e8).setOrigin(0);

    // ヘッダー
    this.add.rectangle(0, 0, GAME_WIDTH, 80, 0x0d1b2a).setOrigin(0);
    this.add.text(GAME_WIDTH / 2, 40, '📄 第三者委員会報告書', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#c8a96e',
    }).setOrigin(0.5);

    // タイトルへ戻るボタン
    const backBtn = this.add.text(18, 40, '← タイトル', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#aaaaaa',
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
    backBtn.on('pointerout', () => backBtn.setColor('#aaaaaa'));
    backBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(350, () => this.scene.start('TitleScene'));
    });

    // サブヘッダー
    this.add.text(GAME_WIDTH / 2, 100, '── 目　次 ──', {
      fontFamily: 'serif',
      fontSize: '14px',
      color: '#5a3e1b',
      letterSpacing: 4,
    }).setOrigin(0.5);

    // CHAPTER_DATA を静的フィールドから取得
    const chapters = GameManager.getChapterData();

    // 2列グリッドでカードを配置
    const cardWidth = 170;
    const cardHeight = 100;
    const colGap = 10;
    const rowGap = 10;
    const startX = (GAME_WIDTH - (cardWidth * 2 + colGap)) / 2;
    const startY = 125;

    chapters.forEach((chapter, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * (cardWidth + colGap);
      const y = startY + row * (cardHeight + rowGap);
      this._createChapterCard(x, y, cardWidth, cardHeight, chapter);
    });

    // フッター：総合スコア
    const footerY = GAME_HEIGHT - 50;
    this.add.rectangle(0, footerY - 10, GAME_WIDTH, 60, 0x0d1b2a).setOrigin(0);
    this.add.text(GAME_WIDTH / 2, footerY + 10, `総合成績：${GameManager.successCount}勝 ${GameManager.failCount}敗`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#c8a96e',
    }).setOrigin(0.5);
  }

  _createChapterCard(x, y, w, h, chapter) {
    const n = chapter.num;
    const isCleared = ProgressManager.isCleared(n);
    const isUnlocked = ProgressManager.isUnlocked(n);

    const container = this.add.container(x, y);

    if (isCleared) {
      // クリア済み：緑背景
      const bg = this.add.rectangle(0, 0, w, h, 0x2d6a2d).setOrigin(0);
      const numText = this.add.text(8, 6, `第${n}編`, {
        fontFamily: 'sans-serif', fontSize: '10px', color: '#aaffaa',
      });
      const titleText = this.add.text(8, 22, chapter.title, {
        fontFamily: 'sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#ffffff',
        wordWrap: { width: w - 16 },
      });
      const statusText = this.add.text(w / 2, h - 22, '✅ 調査完了', {
        fontFamily: 'sans-serif', fontSize: '12px', color: '#aaffaa',
      }).setOrigin(0.5, 0);
      container.add([bg, numText, titleText, statusText]);

    } else if (isUnlocked) {
      // 解放済み（未クリア）：白背景 + カラーバー
      const bg = this.add.rectangle(0, 0, w, h, 0xffffff).setOrigin(0);
      const colorBar = this.add.rectangle(0, 0, 6, h, CHAPTER_COLORS[n] || 0x555555).setOrigin(0);
      const numText = this.add.text(14, 6, `第${n}編`, {
        fontFamily: 'sans-serif', fontSize: '10px', color: '#555555',
      });
      const titleText = this.add.text(14, 22, chapter.title, {
        fontFamily: 'sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#1a1a2e',
        wordWrap: { width: w - 20 },
      });
      const playBtn = this.add.text(w / 2, h - 18, '▶ プレイする', {
        fontFamily: 'sans-serif', fontSize: '12px', color: '#2255cc',
      }).setOrigin(0.5, 0);
      container.add([bg, colorBar, numText, titleText, playBtn]);

      // タップで ChapterIntroScene へ
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(350, () => this.scene.start('ChapterIntroScene', { chapter: n }));
      });
      bg.on('pointerover', () => bg.setFillStyle(0xeef4ff));
      bg.on('pointerout', () => bg.setFillStyle(0xffffff));

    } else {
      // ロック中：黒背景
      const bg = this.add.rectangle(0, 0, w, h, 0x1a1a1a).setOrigin(0);
      const numText = this.add.text(8, 6, `第${n}編`, {
        fontFamily: 'sans-serif', fontSize: '10px', color: '#666666',
      });
      const lockBar = this.add.text(w / 2, h / 2 - 6, '██████████', {
        fontFamily: 'monospace', fontSize: '14px', color: '#444444',
      }).setOrigin(0.5);
      const lockIcon = this.add.text(w - 20, h - 22, '🔒', {
        fontSize: '14px',
      });
      container.add([bg, numText, lockBar, lockIcon]);
    }
  }
}
