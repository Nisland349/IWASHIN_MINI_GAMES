// MG46_Whistle.js - 内部通報をキャッチせよ！
// 操作: 吹き出しを正しい窓口へドラッグ
// 成功: 3個全て正しく届ける / 失敗: 誤送

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const REPORTS = [
  { text: '→通報\n窓口', target: '通報窓口' },
  { text: '→外部\n弁護士', target: '外部弁護士' },
  { text: '→通報\n窓口', target: '通報窓口' },
];
const WINDOWS = ['通報窓口', '外部弁護士'];

export default class MG46_Whistle extends MiniGameBase {
  constructor() {
    super({ key: 'MG46_Whistle' });
    this.gameTitle = '内部通報をキャッチせよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8f5e9).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '正しい窓口へ届けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#1b5e20',
    }).setOrigin(0.5);

    this.delivered = 0;
    this.reportObjs = [];
    super.create();
  }

  onGameStart() {
    // 窓口
    const windowObjs = [];
    WINDOWS.forEach((label, i) => {
      const x = 80 + i * 230;
      const y = GAME_HEIGHT - 100;

      const bg = this.add.rectangle(x, y, 160, 90, 0xc8e6c9)
        .setStrokeStyle(3, 0x388e3c).setDepth(5);
      this.add.text(x, y, label, {
        fontFamily: 'sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#1b5e20',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);

      windowObjs.push({ bg, label, x, y });
    });

    // 吹き出し（タスク）
    REPORTS.forEach((report, i) => {
      const x = 60 + i * 130;
      const y = GAME_HEIGHT / 2 - 80;

      const bg = this.add.rectangle(x, y, 110, 80, 0xffffff)
        .setStrokeStyle(3, 0x43a047)
        .setInteractive()
        .setDepth(10);

      const label = this.add.text(x, y, `💬\n${report.text}`, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#1b5e20',
        align: 'center',
      }).setOrigin(0.5).setDepth(11);

      const reportObj = { bg, label, report, done: false, startX: x, startY: y };
      this.reportObjs.push(reportObj);
      this.input.setDraggable(bg);
    });

    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.reportObjs.find(r => r.bg === go);
      if (obj) obj.label.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.reportObjs.find(r => r.bg === go);
      if (!obj || obj.done) return;

      let dropped = null;
      for (const w of windowObjs) {
        if (Math.abs(go.x - w.x) < 80 && Math.abs(go.y - w.y) < 45) {
          dropped = w;
          break;
        }
      }

      if (dropped) {
        if (dropped.label === obj.report.target) {
          obj.done = true;
          obj.bg.setFillStyle(0xa5d6a7);
          this.delivered++;
          if (this.delivered >= REPORTS.length) {
            this.time.delayedCall(300, () => this.endGame(true));
          }
        } else {
          obj.bg.setFillStyle(0xef9a9a);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
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
