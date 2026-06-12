// MG17_TruthPick.js - 虚偽説明を見破れ！
// 操作: 3択タップ
// 成功: 正しい説明を選ぶ / 失敗: 誤選択

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHOICES = [
  { text: '第三者委員会は\n外部専門家が担当', correct: true },
  { text: '理事長が\n委員会を主導した', correct: false },
  { text: '内部スタッフだけ\nで調査した', correct: false },
];

export default class MG17_TruthPick extends MiniGameBase {
  constructor() {
    super({ key: 'MG17_TruthPick' });
    this.gameTitle = '虚偽説明を見破れ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8f5e9).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '正しい説明はどれ？', {
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
      { x: GAME_WIDTH / 2, y: 280 },
      { x: GAME_WIDTH / 2, y: 450 },
      { x: GAME_WIDTH / 2, y: 620 },
    ];

    shuffled.forEach((choice, i) => {
      const { x, y } = positions[i];
      const W = 300, H = 100;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(3, 0x388e3c)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, choice.text, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#2e7d32',
        align: 'center',
        wordWrap: { width: W - 20 },
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
