// LobbyScene.js - タイトル・スタート画面

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { GameManager } from '../GameManager.js';

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' });
  }

  create() {
    // 背景
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    // タイトル
    this.add.text(GAME_WIDTH / 2, 180, 'いわしん', {
      fontFamily: 'sans-serif',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 250, '製作プロジェクト', {
      fontFamily: 'sans-serif',
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 320, '〜第三者委員会報告書〜', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // スコア表示（前回プレイ分）
    if (GameManager.successCount + GameManager.failCount > 0) {
      this.add.text(
        GAME_WIDTH / 2, 420,
        `前回成績：${GameManager.successCount}勝 ${GameManager.failCount}敗`,
        {
          fontFamily: 'sans-serif',
          fontSize: '20px',
          color: '#ffffff',
        }
      ).setOrigin(0.5);
    }

    // STARTボタン
    const startBtn = this.add.rectangle(
      GAME_WIDTH / 2, 550, 240, 80, 0xff5577
    ).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });

    this.add.text(GAME_WIDTH / 2, 550, 'START', {
      fontFamily: 'sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    startBtn.on('pointerdown', () => {
      GameManager.reset();
      const next = GameManager.pickNextMG();
      this.scene.start(next.key);
    });

    // 操作説明
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 80,
      'PC：マウスクリック / WASD\nスマホ：タップ / スワイプ', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#888888',
      align: 'center',
    }).setOrigin(0.5);
  }
}
