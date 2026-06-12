// MG20_EvidenceSubmit.js - 証拠を提出せよ！
// 操作: ドラッグ
// 成功: 正しい書類を提出ボックスへ / 失敗: 誤提出 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CARDS = ['契約書', '融資台帳', '稟議書', '議事録'];
const TARGET_LABEL = '融資台帳';
const SUBMIT_X = GAME_WIDTH - 60;
const SUBMIT_Y = GAME_HEIGHT / 2;

export default class MG20_EvidenceSubmit extends MiniGameBase {
  constructor() {
    super({ key: 'MG20_EvidenceSubmit' });
    this.gameTitle = '証拠を提出せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfce4ec).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `この資料を提出せよ：${TARGET_LABEL}`, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#880e4f',
    }).setOrigin(0.5);

    this.cardObjs = [];
    super.create();
  }

  onGameStart() {
    // 提出ボックス
    const g = this.add.graphics();
    g.fillStyle(0xf48fb1, 0.5);
    g.fillRoundedRect(SUBMIT_X - 60, SUBMIT_Y - 100, 120, 200, 10);
    g.lineStyle(3, 0xe91e63, 1);
    g.strokeRoundedRect(SUBMIT_X - 60, SUBMIT_Y - 100, 120, 200, 10);

    this.add.text(SUBMIT_X, SUBMIT_Y - 80, '📥\n提出\nボックス', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#880e4f',
      align: 'center',
    }).setOrigin(0.5);

    // カードを縦に並べる
    CARDS.forEach((label, i) => {
      const x = 100;
      const y = 250 + i * 120;
      const W = 140, H = 80;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(2, 0xc2185b)
        .setInteractive()
        .setDepth(10);

      const text = this.add.text(x, y, label, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#c2185b',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.cardObjs.push({ bg, text, label, startX: x, startY: y });
    });

    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.cardObjs.find(c => c.bg === go);
      if (obj) obj.text.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.cardObjs.find(c => c.bg === go);
      if (!obj) return;

      if (go.x > SUBMIT_X - 60) {
        if (obj.label === TARGET_LABEL) {
          obj.bg.setFillStyle(0xa5d6a7);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          obj.bg.setFillStyle(0xef9a9a);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      } else {
        this.tweens.add({
          targets: [go, obj.text],
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
