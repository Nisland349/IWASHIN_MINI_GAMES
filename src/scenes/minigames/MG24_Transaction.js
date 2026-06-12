// MG24_Transaction.js - 不自然な取引をタップせよ！
// 操作: 怪しい取引をタップ
// 成功: 3件の怪しい取引を全てタップ / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const TRANSACTIONS = [
  { text: '¥320,000  09:15  田中商店', suspicious: false },
  { text: '¥999,999  23:55  口座不明', suspicious: true },
  { text: '¥48,000   14:30  山田食品', suspicious: false },
  { text: '¥888,888  00:01  架空会社', suspicious: true },
  { text: '¥75,000   11:20  鈴木書店', suspicious: false },
  { text: '¥777,777  03:33  不明名義', suspicious: true },
  { text: '¥23,000   16:45  中村電器', suspicious: false },
  { text: '¥115,000  10:00  佐藤工務', suspicious: false },
];

const SUSPICIOUS_COUNT = 3;

export default class MG24_Transaction extends MiniGameBase {
  constructor() {
    super({ key: 'MG24_Transaction' });
    this.gameTitle = '不自然な取引を\nタップせよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d1b2a).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '怪しい取引を全てタップ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#4fc3f7',
    }).setOrigin(0.5);

    this.tappedCount = 0;
    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...TRANSACTIONS]);

    shuffled.forEach((t, i) => {
      const y = 120 + i * 82;
      const bg = this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 20, 70, 0x1a2a3a)
        .setStrokeStyle(1, 0x37474f)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      const label = this.add.text(15, y, t.text, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: t.suspicious ? '#ff5252' : '#b0bec5',
      }).setDepth(6);

      if (t.suspicious) {
        this.add.text(GAME_WIDTH - 20, y, '！', {
          fontFamily: 'sans-serif',
          fontSize: '18px',
          fontStyle: 'bold',
          color: '#ff1744',
        }).setOrigin(1, 0.5).setDepth(6);
      }

      bg.on('pointerdown', () => {
        if (!this.isPlaying || bg.tapped) return;
        if (t.suspicious) {
          bg.tapped = true;
          bg.setFillStyle(0x1b5e20);
          bg.setStrokeStyle(2, 0x69f0ae);
          label.setColor('#69f0ae');
          this.tappedCount++;
          if (this.tappedCount >= SUSPICIOUS_COUNT) {
            this.time.delayedCall(300, () => this.endGame(true));
          }
        }
      });
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
