// MG39_CultureChange.js - 組織文化を変えろ！
// 操作: 看板をゴミ箱へドラッグ
// 成功: 3枚全捨て / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const SIGNS = ['上意下達', '隠蔽体質', '独断専行'];
const TRASH_X = GAME_WIDTH / 2;
const TRASH_Y = GAME_HEIGHT - 100;

export default class MG39_CultureChange extends MiniGameBase {
  constructor() {
    super({ key: 'MG39_CultureChange' });
    this.gameTitle = '組織文化を変えろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff3e0).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '古い看板をゴミ箱へ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#e65100',
    }).setOrigin(0.5);

    this.trashed = 0;
    this.cardObjs = [];
    super.create();
  }

  onGameStart() {
    // ゴミ箱
    const g = this.add.graphics();
    g.fillStyle(0x5d4037, 0.7);
    g.fillRoundedRect(TRASH_X - 60, TRASH_Y - 55, 120, 110, 10);
    g.lineStyle(3, 0x3e2723, 1);
    g.strokeRoundedRect(TRASH_X - 60, TRASH_Y - 55, 120, 110, 10);

    this.add.text(TRASH_X, TRASH_Y, '🗑️\nゴミ箱', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    SIGNS.forEach((text, i) => {
      const x = 60 + i * 120;
      const y = GAME_HEIGHT / 2 - 40;
      const W = 110, H = 80;

      const bg = this.add.rectangle(x, y, W, H, 0xd84315)
        .setStrokeStyle(3, 0xbf360c)
        .setInteractive()
        .setDepth(10);

      const label = this.add.text(x, y, text, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: W - 10 },
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.cardObjs.push({ bg, label, trashed: false, startX: x, startY: y });
    });

    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.cardObjs.find(c => c.bg === go);
      if (obj) obj.label.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.cardObjs.find(c => c.bg === go);
      if (!obj || obj.trashed) return;

      const dx = Math.abs(go.x - TRASH_X);
      const dy = Math.abs(go.y - TRASH_Y);

      if (dx < 60 && dy < 55) {
        obj.trashed = true;
        this.tweens.add({
          targets: [go, obj.label],
          scale: 0,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            go.destroy();
            obj.label.destroy();
          },
        });
        this.trashed++;
        if (this.trashed >= SIGNS.length) {
          this.time.delayedCall(300, () => this.endGame(true));
        }
      } else {
        this.tweens.add({
          targets: [go, obj.label],
          x: obj.startX,
          y: obj.startY,
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
