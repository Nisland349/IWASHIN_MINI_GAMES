// MG42_Filing.js - 届出を提出せよ！
// 操作: 書類を正しい窓口へドラッグ
// 成功: 正しい窓口へ提出 / 失敗: 誤提出 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const WINDOWS = ['金融庁', '監査役', '理事会'];
const TARGET_WINDOW = '金融庁';

export default class MG42_Filing extends MiniGameBase {
  constructor() {
    super({ key: 'MG42_Filing' });
    this.gameTitle = '届出を提出せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8f5e9).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `→ ${TARGET_WINDOW}へ提出！`, {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#1b5e20',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    // 3つの窓口
    const windowObjs = [];
    WINDOWS.forEach((label, i) => {
      const x = 65 + i * 130;
      const y = GAME_HEIGHT - 130;
      const isTarget = (label === TARGET_WINDOW);

      const bg = this.add.rectangle(x, y, 120, 100, isTarget ? 0xc8e6c9 : 0xffffff)
        .setStrokeStyle(3, isTarget ? 0x2e7d32 : 0x9e9e9e)
        .setDepth(5);

      this.add.text(x, y, label, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: isTarget ? '#1b5e20' : '#757575',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);

      windowObjs.push({ bg, label, x, y });
    });

    // 書類
    const docX = GAME_WIDTH / 2;
    const docY = GAME_HEIGHT / 2 - 60;

    const doc = this.add.text(docX, docY, '📋', {
      fontSize: '56px',
    }).setOrigin(0.5).setDepth(10).setInteractive();

    this.input.setDraggable(doc);

    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;

      let dropped = null;
      for (const w of windowObjs) {
        if (Math.abs(go.x - w.x) < 60 && Math.abs(go.y - w.y) < 50) {
          dropped = w;
          break;
        }
      }

      if (dropped) {
        if (dropped.label === TARGET_WINDOW) {
          dropped.bg.setFillStyle(0x69f0ae);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          dropped.bg.setFillStyle(0xef9a9a);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      } else {
        // 元の位置に戻す
        this.tweens.add({
          targets: go,
          x: docX,
          y: docY,
          duration: 200,
          ease: 'Back.easeOut',
        });
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
