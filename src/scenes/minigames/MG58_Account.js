// MG58_Account.js - 説明責任を果たせ！
// 操作: 3択選択
// 成功: 「内部統制が不十分だった」を選ぶ / 失敗: 誤選択

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const QUESTION = 'なぜ不正融資が\n発覚しなかったのか？';
const CHOICES = [
  { text: '記憶にない', correct: false },
  { text: '内部統制が\n不十分だった', correct: true },
  { text: '部下のせいだ', correct: false },
];

export default class MG58_Account extends MiniGameBase {
  constructor() {
    super({ key: 'MG58_Account' });
    this.gameTitle = '説明責任を果たせ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a237e).setOrigin(0);

    // 質問表示
    this.add.rectangle(GAME_WIDTH / 2, 150, GAME_WIDTH - 30, 130, 0x283593)
      .setStrokeStyle(2, 0x7986cb);
    this.add.text(GAME_WIDTH / 2, 150, QUESTION, {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#e8eaf6',
      align: 'center',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...CHOICES]);
    const positions = [
      { x: GAME_WIDTH / 2, y: 340 },
      { x: GAME_WIDTH / 2, y: 490 },
      { x: GAME_WIDTH / 2, y: 640 },
    ];

    shuffled.forEach((choice, i) => {
      const { x, y } = positions[i];
      const W = 290, H = 100;

      const bg = this.add.rectangle(x, y, W, H, 0x303f9f)
        .setStrokeStyle(3, 0x5c6bc0)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, choice.text, {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#e8eaf6',
        align: 'center',
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
