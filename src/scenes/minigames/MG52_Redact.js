// MG52_Redact.js - 透明性を上げろ！（黒塗り開示）
// 操作: ドラッグ（スクラブ）で黒塗りをこする
// 成功: ドラッグ距離2500px / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const REQUIRED_DIST = 2500;

export default class MG52_Redact extends MiniGameBase {
  constructor() {
    super({ key: 'MG52_Redact' });
    this.gameTitle = '黒塗りを\n開示せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf5f5f5).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, 'こすって黒塗りを開示！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#212121',
    }).setOrigin(0.5);

    this.totalDist = 0;
    this.lastX = null;
    this.lastY = null;
    super.create();
  }

  onGameStart() {
    // 資料の内容（下層）
    const docBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 320, 420, 0xffffff)
      .setStrokeStyle(3, 0x9e9e9e).setDepth(3);
    const lines = [
      '融資総額：■■■億円',
      '融資先：■■■商事',
      '承認者：前理事長',
      '日付：20■■年■月',
      '担保：なし',
    ];
    lines.forEach((line, i) => {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120 + i * 55, line, {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#212121',
      }).setOrigin(0.5).setDepth(4);
    });

    // 黒塗りオーバーレイ
    this.redactOverlay = this.add.graphics().setDepth(8);
    this._drawRedact(1.0);

    // プログレスバー
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 300, 22, 0x424242).setDepth(20);
    this.progressBar = this.add.rectangle(GAME_WIDTH / 2 - 150, GAME_HEIGHT - 60, 0, 22, 0xffee58)
      .setOrigin(0, 0.5).setDepth(21);
    this.progressText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '開示: 0%', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#212121',
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
        this.progressText.setText(`開示: ${Math.floor(ratio * 100)}%`);
        this._drawRedact(1 - ratio);

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

  _drawRedact(alpha) {
    if (!this.redactOverlay) return;
    this.redactOverlay.clear();
    if (alpha <= 0) return;
    this.redactOverlay.fillStyle(0x000000, alpha);
    this.redactOverlay.fillRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 - 210, 320, 420);
  }

  onTimeUp() {
    this.endGame(false);
  }
}
