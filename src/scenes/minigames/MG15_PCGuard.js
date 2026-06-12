// MG15_PCGuard.js - ノートPCを守れ！
// 操作: WASD左右移動
// 成功: 5秒生存 / 失敗: ハンマーに当たる

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 300;
const HAMMER_INTERVAL_MIN = 2000;
const HAMMER_INTERVAL_MAX = 3000;

export default class MG15_PCGuard extends MiniGameBase {
  constructor() {
    super({ key: 'MG15_PCGuard' });
    this.gameTitle = 'ノートPCを守れ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a237e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, 'ハンマーを避けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.hammers = [];
    this.areaBottom = GAME_HEIGHT - 60;
    super.create();
  }

  onGameStart() {
    // プレイヤー（ノートPC）
    this.player = this.add.text(GAME_WIDTH / 2, this.areaBottom - 20, '💻', {
      fontSize: '40px',
    }).setOrigin(0.5).setDepth(10);

    this._scheduleHammer();
  }

  _scheduleHammer() {
    if (!this.isPlaying) return;
    const delay = HAMMER_INTERVAL_MIN + Math.random() * (HAMMER_INTERVAL_MAX - HAMMER_INTERVAL_MIN);
    this.time.delayedCall(delay, () => {
      if (!this.isPlaying) return;
      this._spawnHammer();
      this._scheduleHammer();
    });
  }

  _spawnHammer() {
    const x = 30 + Math.random() * (GAME_WIDTH - 60);
    const hammer = this.add.text(x, 120, '🔨', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(5);
    this.hammers.push({ obj: hammer, vy: 350 });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    // プレイヤー移動（左右のみ）
    const dir = this.inputHandler.getDirection();
    this.player.x += dir.x * PLAYER_SPEED * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, GAME_WIDTH - 20);

    // ハンマー更新
    for (let i = this.hammers.length - 1; i >= 0; i--) {
      const h = this.hammers[i];
      h.obj.y += h.vy * dt;

      if (h.obj.y > GAME_HEIGHT + 50) {
        h.obj.destroy();
        this.hammers.splice(i, 1);
        continue;
      }

      // 衝突判定
      const dx = h.obj.x - this.player.x;
      const dy = h.obj.y - this.player.y;
      if (Math.abs(dx) < 35 && Math.abs(dy) < 35) {
        this.endGame(false);
        return;
      }
    }
  }

  onTimeUp() {
    this.endGame(true);
  }
}
