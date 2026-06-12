// MG30_PaperCompany.js - ペーパーカンパニーを見つけろ！
// 操作: 3択タップ
// 成功: ペーパーカンパニーを選ぶ / 失敗: 誤選択

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHOICES = [
  { text: '山田建設\n従業員50名', correct: false },
  { text: '中田商事\n実績多数', correct: false },
  { text: 'ペラペラ企業\n実態不明 従業員0名', correct: true },
];

export default class MG30_PaperCompany extends MiniGameBase {
  constructor() {
    super({ key: 'MG30_PaperCompany' });
    this.gameTitle = 'ペーパーカンパニーを\n見つけろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe8eaf6).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '実態のない会社はどれ？', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#1a237e',
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
      const W = 300, H = 110;
      const color = choice.correct ? 0xffecb3 : 0xffffff;

      const bg = this.add.rectangle(x, y, W, H, color)
        .setStrokeStyle(3, 0x3949ab)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, choice.text, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#1a237e',
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
