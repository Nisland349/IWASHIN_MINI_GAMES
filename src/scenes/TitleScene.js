// TitleScene.js - 報告書の表紙風タイトル画面

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    // 背景：濃紺
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d1b2a).setOrigin(0);

    // カメラフェードイン
    this.cameras.main.fadeIn(600, 0, 0, 0);

    const goldColor = '#c8a96e';

    // 上部二重線
    this._drawDoubleLine(60);

    // 上部小見出し
    this.add.text(GAME_WIDTH / 2, 80, '第三者委員会報告書より', {
      fontFamily: 'serif',
      fontSize: '12px',
      color: goldColor,
      letterSpacing: 4,
    }).setOrigin(0.5);

    // メインタイトル
    this.add.text(GAME_WIDTH / 2, 340, 'いわしん', {
      fontFamily: 'serif',
      fontSize: '72px',
      fontStyle: 'bold',
      color: '#ffffff',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // 区切り装飾
    this.add.text(GAME_WIDTH / 2, 430, '── ◆ ──', {
      fontFamily: 'serif',
      fontSize: '14px',
      color: goldColor,
    }).setOrigin(0.5);

    // タグライン
    this.add.text(GAME_WIDTH / 2, 470, '〜 5秒でわかる無断借名融資 〜', {
      fontFamily: 'serif',
      fontSize: '13px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // TAP TO START（点滅）
    const tapText = this.add.text(GAME_WIDTH / 2, 640, 'TAP  TO  START', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
      letterSpacing: 6,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: tapText,
      alpha: 0,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 下部二重線
    this._drawDoubleLine(700);

    // タップで ChapterSelectScene へ遷移
    this.input.once('pointerdown', () => {
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('ChapterSelectScene');
      });
      this.cameras.main.fadeOut(400, 0, 0, 0);
    });
  }

  _drawDoubleLine(y) {
    const g = this.add.graphics();
    const margin = 40;

    g.lineStyle(1, 0xc8a96e, 1);
    g.beginPath();
    g.moveTo(margin, y);
    g.lineTo(GAME_WIDTH - margin, y);
    g.strokePath();

    g.lineStyle(2, 0xc8a96e, 1);
    g.beginPath();
    g.moveTo(margin, y + 4);
    g.lineTo(GAME_WIDTH - margin, y + 4);
    g.strokePath();
  }
}
