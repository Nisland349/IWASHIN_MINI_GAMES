// MG33_NameWilling.js - 名義を借りろ！
// 操作: 手を挙げている人をタップ（3人全員）
// 成功: 手を挙げた3人全員タップ / 失敗: 拒否ポーズをタップ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

export default class MG33_NameWilling extends MiniGameBase {
  constructor() {
    super({ key: 'MG33_NameWilling' });
    this.gameTitle = '名義を借りろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff8e1).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '手を挙げている人をタップ！', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#e65100',
    }).setOrigin(0.5);

    this.found = 0;
    super.create();
  }

  onGameStart() {
    const people = [
      { willing: true }, { willing: false }, { willing: true },
      { willing: false }, { willing: true }, { willing: false },
    ];
    const shuffled = Phaser.Utils.Array.Shuffle([...people]);

    const cols = 3;
    const rows = 2;
    const cellW = GAME_WIDTH / cols;
    const startY = 200;
    const cellH = 220;

    shuffled.forEach((p, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellW + cellW / 2;
      const y = startY + row * cellH;

      const bg = this.add.rectangle(x, y, cellW - 15, cellH - 15, 0xffffff)
        .setStrokeStyle(2, p.willing ? 0x388e3c : 0xd32f2f)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y - 30, p.willing ? '✋' : '🙅', {
        fontSize: '48px',
      }).setOrigin(0.5).setDepth(6);

      this.add.text(x, y + 45, p.willing ? 'OK！' : 'NG', {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: p.willing ? '#388e3c' : '#d32f2f',
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying || bg.selected) return;
        if (p.willing) {
          bg.selected = true;
          bg.setFillStyle(0xc8e6c9);
          this.found++;
          if (this.found >= 3) {
            this.time.delayedCall(300, () => this.endGame(true));
          }
        } else {
          bg.setFillStyle(0xffcdd2);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      });
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
