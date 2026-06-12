// MG49_Dust.js - 風土改善！
// 操作: ドラッグ（スクラブ）でホコリを払う
// 成功: ドラッグ距離3000px / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const REQUIRED_DIST = 3000;

export default class MG49_Dust extends MiniGameBase {
  constructor() {
    super({ key: 'MG49_Dust' });
    this.gameTitle = '風土改善！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x4a4a4a).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, 'こすってホコリを払え！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.totalDist = 0;
    this.lastX = null;
    this.lastY = null;
    super.create();
  }

  onGameStart() {
    // ホコリオーバーレイ（グレードット）
    this.dustOverlay = this.add.graphics().setDepth(5);
    this._drawDust(1.0);

    // プログレスバー
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 300, 22, 0x333333).setDepth(20);
    this.progressBar = this.add.rectangle(GAME_WIDTH / 2 - 150, GAME_HEIGHT - 60, 0, 22, 0x80deea)
      .setOrigin(0, 0.5).setDepth(21);
    this.progressText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '0%', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(22);

    this.input.on('pointermove', (pointer) => {
      if (!this.isPlaying || !pointer.isDown) {
        this.lastX = null;
        this.lastY = null;
        return;
      }

      if (this.lastX !== null) {
        const dx = pointer.x - this.lastX;
        const dy = pointer.y - this.lastY;
        this.totalDist += Math.sqrt(dx * dx + dy * dy);

        const ratio = Math.min(1, this.totalDist / REQUIRED_DIST);
        this.progressBar.width = 300 * ratio;
        this.progressText.setText(`${Math.floor(ratio * 100)}%`);
        this._drawDust(1 - ratio);

        if (this.totalDist >= REQUIRED_DIST) {
          this.endGame(true);
          return;
        }
      }

      this.lastX = pointer.x;
      this.lastY = pointer.y;
    });

    this.input.on('pointerup', () => {
      this.lastX = null;
      this.lastY = null;
    });
  }

  _drawDust(alpha) {
    if (!this.dustOverlay) return;
    this.dustOverlay.clear();
    if (alpha <= 0) return;
    this.dustOverlay.fillStyle(0x9e9e9e, alpha * 0.7);
    // ランダムドット（固定シード的に一定配置）
    for (let i = 0; i < 200; i++) {
      const x = ((i * 137 + 50) % (GAME_WIDTH - 40)) + 20;
      const y = ((i * 97 + 120) % (GAME_HEIGHT - 200)) + 130;
      const r = 4 + (i % 6);
      this.dustOverlay.fillCircle(x, y, r);
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
