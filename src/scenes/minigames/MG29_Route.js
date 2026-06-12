// MG29_Route.js - 迂回ルートをつなげ！
// 操作: A→B→C→X1社の順でタップ
// 成功: 正しい順でタップ / 失敗: 誤タップ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const NODES = [
  { label: 'A社',  x: 80,              y: 300 },
  { label: 'B社',  x: GAME_WIDTH - 80, y: 300 },
  { label: 'C社',  x: 80,              y: 550 },
  { label: 'X1社', x: GAME_WIDTH - 80, y: 550 },
];
const ORDER = ['A社', 'B社', 'C社', 'X1社'];

export default class MG29_Route extends MiniGameBase {
  constructor() {
    super({ key: 'MG29_Route' });
    this.gameTitle = '迂回ルートを\nつなげ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf3e5f5).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `順番にタップ: ${ORDER.join('→')}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#4a148c',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 30 },
    }).setOrigin(0.5);

    this.currentStep = 0;
    this.graphics = this.add.graphics().setDepth(3);
    super.create();
  }

  onGameStart() {
    this.nodeObjs = [];

    NODES.forEach((node) => {
      const bg = this.add.circle(node.x, node.y, 45, 0xce93d8)
        .setStrokeStyle(3, 0x7b1fa2)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      const label = this.add.text(node.x, node.y, node.label, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#4a148c',
      }).setOrigin(0.5).setDepth(6);

      this.nodeObjs.push({ bg, label, ...node });

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        const expected = ORDER[this.currentStep];
        if (node.label === expected) {
          bg.setFillStyle(0x9c27b0).setStrokeStyle(3, 0x4a148c);
          label.setColor('#ffffff');

          if (this.currentStep > 0) {
            const prev = this.nodeObjs.find(n => n.label === ORDER[this.currentStep - 1]);
            this.graphics.lineStyle(4, 0x9c27b0, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(prev.x, prev.y);
            this.graphics.lineTo(node.x, node.y);
            this.graphics.strokePath();
          }

          this.currentStep++;
          this._updateHint();

          if (this.currentStep >= ORDER.length) {
            this.time.delayedCall(300, () => this.endGame(true));
          }
        } else {
          bg.setFillStyle(0xef5350);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      });
    });

    this._createHint();
  }

  _createHint() {
    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, '', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ff6600',
      stroke: '#ffffff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);
    this._updateHint();
  }

  _updateHint() {
    if (!this.hintText) return;
    if (this.currentStep < ORDER.length) {
      this.hintText.setText(`次は「${ORDER[this.currentStep]}」！`);
    } else {
      this.hintText.setText('完成！');
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
