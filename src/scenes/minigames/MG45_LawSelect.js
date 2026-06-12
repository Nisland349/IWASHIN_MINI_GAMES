// MG45_LawSelect.js - 法令を選べ！
// 操作: 3択タップ
// 成功: 信用組合法を選ぶ / 失敗: 誤選択

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHOICES = [
  { text: '銀行法', correct: false },
  { text: '信用組合法', correct: true },
  { text: '道路交通法', correct: false },
];

export default class MG45_LawSelect extends MiniGameBase {
  constructor() {
    super({ key: 'MG45_LawSelect' });
    this.gameTitle = '法令を選べ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a237e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, 'いわしんに適用される法令は？', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#c5cae9',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...CHOICES]);
    const positions = [
      { x: GAME_WIDTH / 2, y: 300 },
      { x: GAME_WIDTH / 2, y: 470 },
      { x: GAME_WIDTH / 2, y: 640 },
    ];

    shuffled.forEach((choice, i) => {
      const { x, y } = positions[i];
      const W = 290, H = 100;

      const bg = this.add.rectangle(x, y, W, H, 0x283593)
        .setStrokeStyle(3, 0x3f51b5)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, choice.text, {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#e8eaf6',
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        if (choice.correct) {
          bg.setFillStyle(0x1b5e20).setStrokeStyle(3, 0x69f0ae);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          bg.setFillStyle(0xb71c1c).setStrokeStyle(3, 0xef5350);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(300, () => this.endGame(false));
        }
      });
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
