// MG60_TruthConnect.js - 真相をつなげ！
// 操作: ノードを正しい順でタップ
// 成功: 全接続 / 失敗: 誤タップ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const NODES = [
  { label: '融資申請', x: 80,              y: 280 },
  { label: '役員承認', x: GAME_WIDTH - 80, y: 280 },
  { label: '資金流出', x: 80,              y: 520 },
  { label: '損失発生', x: GAME_WIDTH - 80, y: 520 },
];
const ORDER = ['融資申請', '役員承認', '資金流出', '損失発生'];

export default class MG60_TruthConnect extends MiniGameBase {
  constructor() {
    super({ key: 'MG60_TruthConnect' });
    this.gameTitle = '真相をつなげ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `順番にタップ: ${ORDER.join('→')}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#90caf9',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 30 },
    }).setOrigin(0.5);

    this.currentStep = 0;
    this.graphics = this.add.graphics().setDepth(3);
    super.create();
  }

  onGameStart() {
    this.nodeObjs = [];

    NODES.forEach(node => {
      const bg = this.add.circle(node.x, node.y, 50, 0x1565c0)
        .setStrokeStyle(3, 0x42a5f5)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      const label = this.add.text(node.x, node.y, node.label, {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#e3f2fd',
        align: 'center',
        wordWrap: { width: 90 },
      }).setOrigin(0.5).setDepth(6);

      this.nodeObjs.push({ bg, label, ...node });

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        const expected = ORDER[this.currentStep];
        if (node.label === expected) {
          bg.setFillStyle(0x0d47a1).setStrokeStyle(3, 0x00e5ff);
          label.setColor('#00e5ff');

          if (this.currentStep > 0) {
            const prev = this.nodeObjs.find(n => n.label === ORDER[this.currentStep - 1]);
            this.graphics.lineStyle(4, 0x00e5ff, 1);
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
          bg.setFillStyle(0xb71c1c);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      });
    });

    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, '', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffee58',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);
    this._updateHint();
  }

  _updateHint() {
    if (!this.hintText) return;
    if (this.currentStep < ORDER.length) {
      this.hintText.setText(`次は「${ORDER[this.currentStep]}」！`);
    } else {
      this.hintText.setText('真相解明！');
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
