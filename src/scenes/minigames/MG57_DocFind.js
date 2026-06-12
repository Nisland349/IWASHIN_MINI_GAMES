// MG57_DocFind.js - 資料を提出せよ！
// 操作: 指定書類をドラッグして提出
// 成功: 正解を提出 / 失敗: 誤提出 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const DOCS = ['契約書', '稟議書', '議事録', '融資台帳', '調査報告'];
const TARGET = '稟議書';
const SUBMIT_X = GAME_WIDTH / 2;
const SUBMIT_Y = GAME_HEIGHT - 100;

export default class MG57_DocFind extends MiniGameBase {
  constructor() {
    super({ key: 'MG57_DocFind' });
    this.gameTitle = '資料を提出せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfafafa).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `この資料を提出：${TARGET}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#212121',
    }).setOrigin(0.5);

    this.cardObjs = [];
    super.create();
  }

  onGameStart() {
    // 提出ボックス
    const g = this.add.graphics();
    g.fillStyle(0xb3e5fc, 0.6);
    g.fillRoundedRect(SUBMIT_X - 80, SUBMIT_Y - 50, 160, 100, 10);
    g.lineStyle(3, 0x0288d1, 1);
    g.strokeRoundedRect(SUBMIT_X - 80, SUBMIT_Y - 50, 160, 100, 10);

    this.add.text(SUBMIT_X, SUBMIT_Y, '📥 提出ボックス', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#01579b',
      align: 'center',
    }).setOrigin(0.5);

    // 書類をランダム配置
    const positions = [
      { x: 70,              y: 220 },
      { x: GAME_WIDTH - 70, y: 280 },
      { x: 120,             y: 450 },
      { x: GAME_WIDTH - 100,y: 380 },
      { x: GAME_WIDTH / 2,  y: 330 },
    ];

    DOCS.forEach((label, i) => {
      const { x, y } = positions[i];
      const W = 120, H = 75;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(2, 0x9e9e9e)
        .setInteractive()
        .setDepth(10);

      const icon = this.add.text(x, y - 12, '📄', { fontSize: '22px' }).setOrigin(0.5).setDepth(11);
      const text = this.add.text(x, y + 18, label, {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#424242',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.cardObjs.push({ bg, icon, text, label, startX: x, startY: y });
    });

    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.cardObjs.find(c => c.bg === go);
      if (obj) {
        obj.icon.setPosition(x, y - 12);
        obj.text.setPosition(x, y + 18);
      }
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.cardObjs.find(c => c.bg === go);
      if (!obj) return;

      const dx = Math.abs(go.x - SUBMIT_X);
      const dy = Math.abs(go.y - SUBMIT_Y);

      if (dx < 80 && dy < 50) {
        if (obj.label === TARGET) {
          obj.bg.setFillStyle(0xb3e5fc);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          obj.bg.setFillStyle(0xffcdd2);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      } else {
        this.tweens.add({
          targets: [go, obj.icon, obj.text],
          x: obj.startX,
          y: obj.startY,
          duration: 200,
          ease: 'Back.easeOut',
          onUpdate: () => {
            obj.icon.setPosition(go.x, go.y - 12);
            obj.text.setPosition(go.x, go.y + 18);
          },
        });
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
