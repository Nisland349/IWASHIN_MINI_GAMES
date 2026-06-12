// MG54_BestPractice.js - 改善策を選べ！
// 操作: 3択タップ
// 成功: 「独立した監査委員会を設置する」を選ぶ / 失敗: 誤選択

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHOICES = [
  { text: '内部告発者を\n処罰する', correct: false },
  { text: '独立した監査委員会\nを設置する', correct: true },
  { text: '問題を\n公表しない', correct: false },
];

export default class MG54_BestPractice extends MiniGameBase {
  constructor() {
    super({ key: 'MG54_BestPractice' });
    this.gameTitle = '改善策を選べ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8f5e9).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '正しい改善策はどれ？', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#1b5e20',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...CHOICES]);
    const positions = [
      { x: GAME_WIDTH / 2, y: 290 },
      { x: GAME_WIDTH / 2, y: 470 },
      { x: GAME_WIDTH / 2, y: 650 },
    ];

    shuffled.forEach((choice, i) => {
      const { x, y } = positions[i];
      const W = 300, H = 110;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(3, 0x388e3c)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, choice.text, {
        fontFamily: 'sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        color: '#2e7d32',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        if (choice.correct) {
          bg.setFillStyle(0xa5d6a7);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          bg.setFillStyle(0xef9a9a);
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
