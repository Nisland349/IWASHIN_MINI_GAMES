// MG47_AuditGuide.js - 外部監査を招け！
// 操作: クリックした場所へ会計士が移動
// 成功: 会議室に到達 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const AUDITOR_SPEED = 220;
const DOOR_X = GAME_WIDTH - 50;
const DOOR_Y = GAME_HEIGHT / 2;

export default class MG47_AuditGuide extends MiniGameBase {
  constructor() {
    super({ key: 'MG47_AuditGuide' });
    this.gameTitle = '外部監査を招け！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf5f5f5).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, 'タップした場所へ会計士が移動！', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    this.targetX = 50;
    this.targetY = GAME_HEIGHT / 2;
    super.create();
  }

  onGameStart() {
    // 会議室
    this.add.rectangle(DOOR_X, DOOR_Y, 80, 160, 0xbbdefb)
      .setStrokeStyle(3, 0x1565c0);
    this.add.text(DOOR_X, DOOR_Y, '🚪\n会議室', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#0d47a1',
      align: 'center',
    }).setOrigin(0.5);

    // 会計士
    this.auditor = this.add.text(50, GAME_HEIGHT / 2, '👨‍💼', {
      fontSize: '44px',
    }).setOrigin(0.5).setDepth(10);

    // クリックで目標設定
    this.input.on('pointerdown', (pointer) => {
      if (!this.isPlaying) return;
      this.targetX = pointer.x;
      this.targetY = pointer.y;

      // ターゲットマーカー
      if (this.marker) this.marker.destroy();
      this.marker = this.add.text(this.targetX, this.targetY, '✦', {
        fontSize: '20px',
        color: '#ff6600',
      }).setOrigin(0.5).setDepth(5);
    });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    const dx = this.targetX - this.auditor.x;
    const dy = this.targetY - this.auditor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      this.auditor.x += (dx / dist) * AUDITOR_SPEED * dt;
      this.auditor.y += (dy / dist) * AUDITOR_SPEED * dt;
    }

    // 会議室到達判定
    if (Math.abs(this.auditor.x - DOOR_X) < 50 && Math.abs(this.auditor.y - DOOR_Y) < 80) {
      this.endGame(true);
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
