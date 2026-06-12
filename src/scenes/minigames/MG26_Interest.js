// MG26_Interest.js - 利息を計算せよ！
// 操作: 3択選択
// ※このゲームは必ず失敗する（ギャグ）

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHOICES = ['¥3,240万', '¥5,100万', '¥8,760万'];

export default class MG26_Interest extends MiniGameBase {
  constructor() {
    super({ key: 'MG26_Interest' });
    this.gameTitle = '利息を計算せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf5f5f5).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '正しい利息はどれ？', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 115, '融資総額 ??? 万円 × 金利 ???%', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5);

    this.msgText = null;
    super.create();
  }

  onGameStart() {
    const positions = [280, 460, 640];

    CHOICES.forEach((label, i) => {
      const y = positions[i];
      const bg = this.add.rectangle(GAME_WIDTH / 2, y, 280, 90, 0xffffff)
        .setStrokeStyle(3, 0x9e9e9e)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(GAME_WIDTH / 2, y, label, {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#424242',
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        bg.setFillStyle(0xffccbc);

        if (!this.msgText) {
          this.msgText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, '計算不能！\n帳簿が改ざんされている！', {
            fontFamily: 'sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#b71c1c',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 4,
          }).setOrigin(0.5).setDepth(100);
        }

        this.cameras.main.shake(300, 0.015);
        this.time.delayedCall(1000, () => this.endGame(false));
      });
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
