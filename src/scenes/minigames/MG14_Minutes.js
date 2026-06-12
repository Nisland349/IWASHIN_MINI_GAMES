// MG14_Minutes.js - 議事録を作成せよ！
// 操作: タップ（並べ替え）
// 成功: キーワードを正しい順にタップ / 失敗: 誤順序 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const SEQUENCE = ['開会宣言', '議題報告', '審議・決議', '閉会'];

export default class MG14_Minutes extends MiniGameBase {
  constructor() {
    super({ key: 'MG14_Minutes' });
    this.gameTitle = '議事録を作成せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfafafa).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '正しい順番にタップ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    // 正しい順番を上部に表示
    const hintY = 110;
    this.add.text(GAME_WIDTH / 2, hintY, SEQUENCE.join('  →  '), {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#888888',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 30 },
    }).setOrigin(0.5);

    this.currentStep = 0;
    this.buttons = [];
    super.create();
  }

  onGameStart() {
    this._updateHint();

    const shuffled = Phaser.Utils.Array.Shuffle([...SEQUENCE]);
    const positions = [
      { x: 90,              y: 340 },
      { x: GAME_WIDTH - 90, y: 340 },
      { x: 90,              y: 520 },
      { x: GAME_WIDTH - 90, y: 520 },
    ];

    shuffled.forEach((word, i) => {
      const { x, y } = positions[i];
      this._createButton(x, y, word);
    });

    this._createArrowIndicator();
  }

  _createButton(x, y, word) {
    const W = 150, H = 80;
    const bg = this.add.rectangle(x, y, W, H, 0xffffff)
      .setStrokeStyle(3, 0x1565c0)
      .setInteractive()
      .setDepth(5);

    const stepNum = SEQUENCE.indexOf(word) + 1;
    this.add.text(x - W / 2 + 12, y - H / 2 + 8, `${stepNum}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#aaaaaa',
    }).setDepth(6);

    const label = this.add.text(x, y, word, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#1565c0',
      align: 'center',
      wordWrap: { width: W - 16 },
    }).setOrigin(0.5).setDepth(6);

    this.buttons.push({ bg, label, word });

    bg.on('pointerdown', () => {
      if (!this.isPlaying) return;
      const expected = SEQUENCE[this.currentStep];
      if (word === expected) {
        bg.setFillStyle(0xbbdefb).setStrokeStyle(3, 0x0d47a1);
        bg.disableInteractive();
        this.currentStep++;
        this._updateHint();
        if (this.currentStep >= SEQUENCE.length) {
          this.time.delayedCall(200, () => this.endGame(true));
        }
      } else {
        bg.setFillStyle(0xffcdd2).setStrokeStyle(3, 0xc62828);
        this.cameras.main.shake(200, 0.01);
        this.time.delayedCall(300, () => this.endGame(false));
      }
    });
  }

  _createArrowIndicator() {
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
    if (this.currentStep < SEQUENCE.length) {
      this.hintText.setText(`次は「${SEQUENCE[this.currentStep]}」！`);
    } else {
      this.hintText.setText('完成！');
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
