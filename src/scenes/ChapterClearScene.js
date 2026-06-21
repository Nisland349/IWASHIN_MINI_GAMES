// ChapterClearScene.js - 章クリア画面

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { GameManager } from '../GameManager.js';
import { ProgressManager } from '../ProgressManager.js';

export default class ChapterClearScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterClearScene' });
    this.chapterNum = 1;
  }

  init(data) {
    this.chapterNum = data.chapter || 1;
  }

  create() {
    // 章クリアを記録
    ProgressManager.clearChapter(this.chapterNum);

    // 背景：濃紺
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d1b2a).setOrigin(0);

    // 星空演出（金色の★をランダム配置）
    for (let i = 0; i < 40; i++) {
      const sx = Phaser.Math.Between(10, GAME_WIDTH - 10);
      const sy = Phaser.Math.Between(10, GAME_HEIGHT - 10);
      const size = Phaser.Math.FloatBetween(8, 20);
      const alpha = Phaser.Math.FloatBetween(0.3, 0.9);
      const star = this.add.text(sx, sy, '★', {
        fontFamily: 'sans-serif',
        fontSize: `${size}px`,
        color: '#c8a96e',
      }).setOrigin(0.5).setAlpha(alpha);

      // 星がゆらゆら光る
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.4),
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 1000),
      });
    }

    // "調 査 完 了 ！"
    const clearText = this.add.text(GAME_WIDTH / 2, 260, '調 査 完 了 ！', {
      fontFamily: 'serif',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#c8a96e',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: clearText,
      alpha: 1,
      y: 240,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // "第 X 編"
    this.add.text(GAME_WIDTH / 2, 320, `第  ${this.chapterNum}  編`, {
      fontFamily: 'serif',
      fontSize: '22px',
      color: '#ffffff',
      letterSpacing: 10,
    }).setOrigin(0.5);

    // ★★★
    this.add.text(GAME_WIDTH / 2, 380, '★  ★  ★', {
      fontFamily: 'sans-serif',
      fontSize: '40px',
      color: '#ffdd00',
    }).setOrigin(0.5);

    // 金色区切り線
    const g = this.add.graphics();
    const margin = 40;
    g.lineStyle(2, 0xc8a96e, 0.8);
    g.beginPath();
    g.moveTo(margin, 430);
    g.lineTo(GAME_WIDTH - margin, 430);
    g.strokePath();

    // 次の編解放メッセージ
    const isLastChapter = this.chapterNum >= 10;
    if (isLastChapter) {
      this.add.text(GAME_WIDTH / 2, 470, '全編 調査完了！\nお疲れ様でした', {
        fontFamily: 'serif',
        fontSize: '18px',
        color: '#88ccff',
        align: 'center',
        lineSpacing: 8,
      }).setOrigin(0.5);
    } else {
      this.add.text(GAME_WIDTH / 2, 470, `第${this.chapterNum + 1}編 が解放されました`, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: '#88ccff',
      }).setOrigin(0.5);
    }

    // 総合スコア
    this.add.text(GAME_WIDTH / 2, 540, `総合成績：${GameManager.successCount}勝 ${GameManager.failCount}敗`, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // "続ける ▶" ボタン
    const btnBg = this.add.rectangle(GAME_WIDTH / 2, 640, 200, 56, 0xc8a96e).setOrigin(0.5);
    const btnText = this.add.text(GAME_WIDTH / 2, 640, '続ける  ▶', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#1a1a2e',
    }).setOrigin(0.5);

    btnBg.setInteractive({ useHandCursor: true });
    btnBg.on('pointerover', () => btnBg.setFillStyle(0xe8c97e));
    btnBg.on('pointerout', () => btnBg.setFillStyle(0xc8a96e));
    btnBg.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(450, () => this.scene.start('ChapterSelectScene'));
    });
  }
}
