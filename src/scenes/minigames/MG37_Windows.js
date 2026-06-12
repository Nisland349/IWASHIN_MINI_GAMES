// MG37_Windows.js - 風通しを良くせよ！
// 操作: 窓をクリックして開ける
// 成功: 5個全部開ける / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const WINDOW_COUNT = 5;

export default class MG37_Windows extends MiniGameBase {
  constructor() {
    super({ key: 'MG37_Windows' });
    this.gameTitle = '風通しを良くせよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x546e7a).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '窓を全部開けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#b2ebf2',
    }).setOrigin(0.5);

    this.openedCount = 0;
    super.create();
  }

  onGameStart() {
    const cols = 3;
    const rows = 2;
    // 5個配置 (3+2)
    const positions = [];
    for (let r = 0; r < rows; r++) {
      const colsInRow = r === 0 ? 3 : 2;
      const offsetX = r === 1 ? (GAME_WIDTH - 40) / 3 / 2 : 0;
      for (let c = 0; c < colsInRow; c++) {
        const cellW = (GAME_WIDTH - 40) / 3;
        const x = 20 + offsetX + c * cellW + cellW / 2;
        const y = 220 + r * 220;
        positions.push({ x, y });
      }
    }

    positions.slice(0, WINDOW_COUNT).forEach((pos) => {
      const W = 100, H = 120;
      const bg = this.add.rectangle(pos.x, pos.y, W, H, 0x455a64)
        .setStrokeStyle(3, 0x263238)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      const icon = this.add.text(pos.x, pos.y - 10, '🪟', {
        fontSize: '44px',
      }).setOrigin(0.5).setDepth(6);

      const statusLabel = this.add.text(pos.x, pos.y + 45, '閉', {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: '#90a4ae',
      }).setOrigin(0.5).setDepth(6);

      bg.on('pointerdown', () => {
        if (!this.isPlaying || bg.opened) return;
        bg.opened = true;
        bg.disableInteractive();
        bg.setFillStyle(0x80deea).setStrokeStyle(3, 0x00838f);
        icon.setText('🌬️');
        statusLabel.setText('開').setColor('#00e5ff');

        this.tweens.add({
          targets: bg,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 120,
          yoyo: true,
        });

        this.openedCount++;
        if (this.openedCount >= WINDOW_COUNT) {
          this.time.delayedCall(300, () => this.endGame(true));
        }
      });
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
