// MG56_Contradiction.js - 記憶違いを見破れ！
// 操作: 矛盾しているカードをタップ
// 成功: 矛盾カードをタップ / 失敗: 誤タップ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const TESTIMONIES = [
  { text: '8月に\n融資が行われた', contradiction: false },
  { text: '理事長の\n承認はあった', contradiction: false },
  { text: '融資は9月だと\n証言していた', contradiction: true },
];

export default class MG56_Contradiction extends MiniGameBase {
  constructor() {
    super({ key: 'MG56_Contradiction' });
    this.gameTitle = '記憶違いを見破れ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x263238).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '矛盾している証言はどれ？', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#80cbc4',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...TESTIMONIES]);
    const positions = [
      { x: GAME_WIDTH / 2, y: 290 },
      { x: GAME_WIDTH / 2, y: 470 },
      { x: GAME_WIDTH / 2, y: 650 },
    ];

    shuffled.forEach((t, i) => {
      const { x, y } = positions[i];
      const W = 300, H = 110;

      const bg = this.add.rectangle(x, y, W, H, 0x37474f)
        .setStrokeStyle(3, 0x546e7a)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y - 15, '💬', { fontSize: '24px' }).setOrigin(0.5).setDepth(6);
      this.add.text(x, y + 20, t.text, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: '#eceff1',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        if (t.contradiction) {
          bg.setFillStyle(0xffd54f).setStrokeStyle(3, 0xff8f00);
          this.cameras.main.flash(200, 255, 215, 0);
          this.time.delayedCall(300, () => this.endGame(true));
        } else {
          bg.setFillStyle(0xb71c1c);
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
