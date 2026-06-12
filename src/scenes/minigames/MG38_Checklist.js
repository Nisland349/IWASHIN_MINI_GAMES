// MG38_Checklist.js - 内部統制を整えろ！
// 操作: 順番タップ（MG14と同様）
// 成功: 正しい順でタップ / 失敗: 誤順序

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const SEQUENCE = ['リスク評価', '規程整備', '運用実施', '監査・改善'];

export default class MG38_Checklist extends MiniGameBase {
  constructor() {
    super({ key: 'MG38_Checklist' });
    this.gameTitle = '内部統制を整えろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8f5e9).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '正しい順番にタップ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#1b5e20',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 110, SEQUENCE.join(' → '), {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#888888',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 30 },
    }).setOrigin(0.5);

    this.currentStep = 0;
    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...SEQUENCE]);
    const positions = [
      { x: 95,              y: 340 },
      { x: GAME_WIDTH - 95, y: 340 },
      { x: 95,              y: 520 },
      { x: GAME_WIDTH - 95, y: 520 },
    ];

    shuffled.forEach((word, i) => {
      const { x, y } = positions[i];
      const W = 155, H = 85;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(3, 0x388e3c)
        .setInteractive()
        .setDepth(5);

      this.add.text(x, y, word, {
        fontFamily: 'sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#2e7d32',
        align: 'center',
        wordWrap: { width: W - 16 },
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        const expected = SEQUENCE[this.currentStep];
        if (word === expected) {
          bg.setFillStyle(0xc8e6c9).setStrokeStyle(3, 0x1b5e20);
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
    });

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
