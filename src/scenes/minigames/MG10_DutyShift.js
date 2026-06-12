// MG10_DutyShift.js - 職務分掌を押し付けろ！
// 操作: ドラッグ
// 成功: 業務カードを全て他部署へ移動 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CARDS = ['融資審査', 'リスク管理', '内部監査'];
const CARD_W = 130;
const CARD_H = 70;
const TARGET_X = GAME_WIDTH - 100;
const TARGET_Y = GAME_HEIGHT / 2;
const TARGET_W = 130;
const TARGET_H = 220;

export default class MG10_DutyShift extends MiniGameBase {
  constructor() {
    super({ key: 'MG10_DutyShift' });
    this.gameTitle = '職務分掌を\n押し付けろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xeceff1).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '業務カードを他部署へ投げろ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    this.shifted = 0;
    this.cardObjs = [];
    super.create();
  }

  onGameStart() {
    this._drawDepts();
    this._spawnCards();
    this._setupDrag();
  }

  _drawDepts() {
    const g = this.add.graphics();

    // 自部署（左）
    g.fillStyle(0xbbdefb, 0.6);
    g.fillRoundedRect(10, GAME_HEIGHT / 2 - 140, 170, 280, 12);
    g.lineStyle(2, 0x1565c0, 0.5);
    g.strokeRoundedRect(10, GAME_HEIGHT / 2 - 140, 170, 280, 12);

    this.add.text(95, GAME_HEIGHT / 2 - 120, '自部署', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#1565c0',
    }).setOrigin(0.5);

    // 他部署（右）
    g.fillStyle(0xffccbc, 0.6);
    g.fillRoundedRect(GAME_WIDTH - 150, GAME_HEIGHT / 2 - 140, 140, 280, 12);
    g.lineStyle(2, 0xbf360c, 0.5);
    g.strokeRoundedRect(GAME_WIDTH - 150, GAME_HEIGHT / 2 - 140, 140, 280, 12);

    this.add.text(GAME_WIDTH - 80, GAME_HEIGHT / 2 - 120, '他部署\nここへ！', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#bf360c',
      align: 'center',
    }).setOrigin(0.5);
  }

  _spawnCards() {
    CARDS.forEach((label, i) => {
      const y = GAME_HEIGHT / 2 - 60 + i * 90;
      const x = 95;

      const bg = this.add.rectangle(x, y, CARD_W, CARD_H, 0xffffff)
        .setStrokeStyle(2, 0x1565c0)
        .setInteractive()
        .setDepth(10);

      const text = this.add.text(x, y, label, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#1565c0',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.cardObjs.push({ bg, text, shifted: false, startX: x, startY: y });
    });
  }

  _setupDrag() {
    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.cardObjs.find(c => c.bg === go);
      if (obj) obj.text.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.cardObjs.find(c => c.bg === go);
      if (!obj || obj.shifted) return;

      if (go.x > GAME_WIDTH - 160) {
        // 成功：他部署に置いた
        obj.shifted = true;
        obj.bg.setFillStyle(0xffccbc).setStrokeStyle(2, 0xbf360c);
        obj.text.setColor('#bf360c');
        this.shifted++;
        if (this.shifted >= CARDS.length) {
          this.time.delayedCall(300, () => this.endGame(true));
        }
      } else {
        // 元に戻す
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
