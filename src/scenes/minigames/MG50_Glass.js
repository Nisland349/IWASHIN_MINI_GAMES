// MG50_Glass.js - 透明性を上げろ！
// 操作: ドラッグ（スクラブ）でガラスを磨く
// 成功: ドラッグ距離2500px / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const REQUIRED_DIST = 2500;

export default class MG50_Glass extends MiniGameBase {
  constructor() {
    super({ key: 'MG50_Glass' });
    this.gameTitle = '透明性を上げろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1565c0).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, 'ガラスをこすって磨け！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#e3f2fd',
    }).setOrigin(0.5);

    this.totalDist = 0;
    this.lastX = null;
    this.lastY = null;
    super.create();
  }

  onGameStart() {
    // 内部の景色（ガラスの向こう）
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 40, 500, 0xe3f2fd)
      .setStrokeStyle(3, 0x1565c0).setDepth(3);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '📊 真実の情報', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#1565c0',
    }).setOrigin(0.5).setDepth(4);

    // 曇りオーバーレイ
    this.fogOverlay = this.add.graphics().setDepth(8);
    this._drawFog(1.0);

    // プログレスバー
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 300, 22, 0x0d47a1).setDepth(20);
    this.progressBar = this.add.rectangle(GAME_WIDTH / 2 - 150, GAME_HEIGHT - 60, 0, 22, 0x40c4ff)
      .setOrigin(0, 0.5).setDepth(21);
    this.progressText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '透明度: 0%', {
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
        this.progressText.setText(`透明度: ${Math.floor(ratio * 100)}%`);
        this._drawFog(1 - ratio);

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

  _drawFog(alpha) {
    if (!this.fogOverlay) return;
    this.fogOverlay.clear();
    if (alpha <= 0) return;
    this.fogOverlay.fillStyle(0x90a4ae, alpha * 0.85);
    this.fogOverlay.fillRect(20, 130, GAME_WIDTH - 40, 500);
  }

  onTimeUp() {
    this.endGame(false);
  }
}
