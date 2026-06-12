// MG34_Investigation.js - 実態を確認せよ！
// 操作: クリックで調査
// 成功: 空っぽの会社を発見 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const COMPANY_COUNT = 4;

export default class MG34_Investigation extends MiniGameBase {
  constructor() {
    super({ key: 'MG34_Investigation' });
    this.gameTitle = '実態を確認せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8eaf6).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '空っぽの会社を見つけろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#1a237e',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const emptyIdx = Math.floor(Math.random() * COMPANY_COUNT);
    const labels = ['田中建設', '山田物産', '鈴木商事', '中村工業'];

    const cols = 2;
    const cellW = (GAME_WIDTH - 40) / cols;
    const cellH = 200;
    const startY = 160;

    for (let i = 0; i < COMPANY_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 20 + col * cellW + cellW / 2;
      const y = startY + row * cellH;
      const isEmpty = (i === emptyIdx);

      const bg = this.add.rectangle(x, y, cellW - 15, cellH - 15, 0xffffff)
        .setStrokeStyle(2, 0x3f51b5)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y - 30, '🏢', {
        fontSize: '44px',
      }).setOrigin(0.5).setDepth(6);

      const nameLabel = this.add.text(x, y + 35, labels[i], {
        fontFamily: 'sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#283593',
      }).setOrigin(0.5).setDepth(6);

      const resultLabel = this.add.text(x, y + 62, '', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(7);

      bg.on('pointerdown', () => {
        if (!this.isPlaying || bg.checked) return;
        bg.checked = true;
        bg.disableInteractive();

        if (isEmpty) {
          bg.setFillStyle(0xffeb3b);
          resultLabel.setText('空っぽ！').setColor('#b71c1c');
          this.cameras.main.flash(200, 255, 255, 0);
          this.time.delayedCall(500, () => this.endGame(true));
        } else {
          bg.setFillStyle(0xbbdefb);
          resultLabel.setText('実態あり').setColor('#1565c0');
        }
      });
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
