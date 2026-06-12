// MG18_HDDSearch.js - バックアップを探せ！
// 操作: クリック選択
// 成功: 正しいHDDをクリック / 失敗: 誤クリック

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const HDD_COUNT = 5;

export default class MG18_HDDSearch extends MiniGameBase {
  constructor() {
    super({ key: 'MG18_HDDSearch' });
    this.gameTitle = 'バックアップを探せ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x263238).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, 'BACKUPのHDDをクリック！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#80cbc4',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const correctIdx = Math.floor(Math.random() * HDD_COUNT);
    const cols = 5;
    const spacing = (GAME_WIDTH - 40) / cols;

    for (let i = 0; i < HDD_COUNT; i++) {
      const x = 20 + spacing * i + spacing / 2;
      const y = GAME_HEIGHT / 2;
      const isCorrect = (i === correctIdx);

      const color = isCorrect ? 0x00897b : 0x546e7a;
      const bg = this.add.rectangle(x, y, spacing - 10, 120, color)
        .setStrokeStyle(2, isCorrect ? 0x00e5ff : 0x90a4ae)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y - 25, '💾', {
        fontSize: '32px',
      }).setOrigin(0.5).setDepth(6);

      if (isCorrect) {
        this.add.text(x, y + 20, 'BACKUP\n✓', {
          fontFamily: 'sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#00e5ff',
          align: 'center',
        }).setOrigin(0.5).setDepth(6);
      } else {
        this.add.text(x, y + 20, `HDD-${i + 1}`, {
          fontFamily: 'sans-serif',
          fontSize: '12px',
          color: '#b0bec5',
          align: 'center',
        }).setOrigin(0.5).setDepth(6);
      }

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        if (isCorrect) {
          bg.setFillStyle(0x4db6ac);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          bg.setFillStyle(0xef5350);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      });
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
