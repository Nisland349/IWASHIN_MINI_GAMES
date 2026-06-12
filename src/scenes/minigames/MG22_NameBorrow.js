// MG22_NameBorrow.js - 無断借名を見破れ！
// 操作: 3択タップ
// 成功: 怪しい名義を選ぶ / 失敗: 誤選択

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHOICES = [
  { text: '田中太郎\n会社員', correct: false },
  { text: '山田花子\n主婦', correct: false },
  { text: '架空太郎\n存在不明', correct: true },
];

export default class MG22_NameBorrow extends MiniGameBase {
  constructor() {
    super({ key: 'MG22_NameBorrow' });
    this.gameTitle = '無断借名を\n見破れ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff3e0).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '怪しい名義はどれ？', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#e65100',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...CHOICES]);
    const positions = [
      { x: GAME_WIDTH / 2, y: 280 },
      { x: GAME_WIDTH / 2, y: 460 },
      { x: GAME_WIDTH / 2, y: 640 },
    ];

    shuffled.forEach((choice, i) => {
      const { x, y } = positions[i];
      const W = 280, H = 110;

      const bg = this.add.rectangle(x, y, W, H, 0xffffff)
        .setStrokeStyle(3, 0xff6f00)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, choice.text, {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#bf360c',
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
