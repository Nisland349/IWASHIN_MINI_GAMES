// MG25_NameSelect.js - 名義を集めろ！
// 操作: 指定名義のカードをタップ（2個）
// 成功: 指定名義を2個全てタップ / 失敗: 誤選択 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const TARGET = '鈴木商事';
const ALL_NAMES = [
  '田中建設', '鈴木商事', '山田物産', '中村工業',
  '鈴木商事', '佐藤食品', '渡辺商店', '伊藤製作',
  '小林電気',
];

export default class MG25_NameSelect extends MiniGameBase {
  constructor() {
    super({ key: 'MG25_NameSelect' });
    this.gameTitle = '名義を集めろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe3f2fd).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `この名義を探せ：${TARGET}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#0d47a1',
    }).setOrigin(0.5);

    this.foundCount = 0;
    this.targetCount = ALL_NAMES.filter(n => n === TARGET).length;
    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...ALL_NAMES]);
    const cols = 3;
    const rows = 3;
    const cellW = (GAME_WIDTH - 20) / cols;
    const cellH = 130;
    const startY = 160;

    shuffled.forEach((name, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 10 + col * cellW + cellW / 2;
      const y = startY + row * cellH;
      const isTarget = (name === TARGET);

      const bg = this.add.rectangle(x, y, cellW - 10, cellH - 15, 0xffffff)
        .setStrokeStyle(2, 0x1565c0)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      this.add.text(x, y, name, {
        fontFamily: 'sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#1565c0',
        align: 'center',
        wordWrap: { width: cellW - 20 },
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying || bg.selected) return;
        if (isTarget) {
          bg.selected = true;
          bg.setFillStyle(0xbbdefb).setStrokeStyle(3, 0x0d47a1);
          this.foundCount++;
          if (this.foundCount >= this.targetCount) {
            this.time.delayedCall(300, () => this.endGame(true));
          }
        } else {
          bg.setFillStyle(0xffcdd2);
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
