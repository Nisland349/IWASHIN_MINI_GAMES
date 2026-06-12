// MG53_Retire.js - 役員退任を進めろ！
// 操作: 役員カードを「退任席」へドラッグ
// 成功: 3枚全移動 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const OFFICERS = ['役員A\n前理事長', '役員B\n前常務', '役員C\n前監事'];
const RETIRE_X = GAME_WIDTH - 80;
const RETIRE_Y = GAME_HEIGHT / 2;

export default class MG53_Retire extends MiniGameBase {
  constructor() {
    super({ key: 'MG53_Retire' });
    this.gameTitle = '役員退任を進めろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfce4ec).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '役員を退任席へドラッグ！', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#880e4f',
    }).setOrigin(0.5);

    this.moved = 0;
    this.cardObjs = [];
    super.create();
  }

  onGameStart() {
    // 退任席（右端）
    const g = this.add.graphics();
    g.fillStyle(0xf8bbd0, 0.6);
    g.fillRoundedRect(RETIRE_X - 70, RETIRE_Y - 160, 140, 320, 10);
    g.lineStyle(3, 0xe91e63, 1);
    g.strokeRoundedRect(RETIRE_X - 70, RETIRE_Y - 160, 140, 320, 10);

    this.add.text(RETIRE_X, RETIRE_Y - 130, '退任席\nここへ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#880e4f',
      align: 'center',
    }).setOrigin(0.5);

    OFFICERS.forEach((text, i) => {
      const x = 90;
      const y = 260 + i * 160;
      const W = 150, H = 100;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(2, 0xe91e63)
        .setInteractive()
        .setDepth(10);

      const label = this.add.text(x, y, `👤\n${text}`, {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#880e4f',
        align: 'center',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.cardObjs.push({ bg, label, moved: false, startX: x, startY: y });
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
      if (!obj || obj.moved) return;

      if (go.x > RETIRE_X - 70) {
        obj.moved = true;
        obj.bg.setFillStyle(0xf8bbd0).setStrokeStyle(2, 0xe91e63);
        obj.label.setColor('#ad1457');
        this.moved++;
        if (this.moved >= OFFICERS.length) {
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
