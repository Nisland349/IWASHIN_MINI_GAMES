// MG21_MemoryDodge.js - 記憶違いを回避せよ！
// 操作: WASD移動
// 成功: 5秒生存 / 失敗: 吹き出しに接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 270;
const BUBBLE_COUNT = 5;

export default class MG21_MemoryDodge extends MiniGameBase {
  constructor() {
    super({ key: 'MG21_MemoryDodge' });
    this.gameTitle = '記憶違いを回避せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x4a148c).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '「記憶にない」を避けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#e1bee7',
    }).setOrigin(0.5);

    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;
    this.bubbles = [];
    super.create();
  }

  onGameStart() {
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 200, 20, 0xce93d8)
      .setStrokeStyle(3, 0xffffff).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 200, '私', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#212121',
    }).setOrigin(0.5).setDepth(11);

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      let x, y;
      do {
        x = 60 + Math.random() * (GAME_WIDTH - 120);
        y = this.areaTop + 60 + Math.random() * (this.areaBottom - this.areaTop - 120);
      } while (Math.abs(x - this.player.x) < 80 && Math.abs(y - this.player.y) < 80);

      const speed = 90 + Math.random() * 70;
      const angle = Math.random() * Math.PI * 2;

      const bg = this.add.rectangle(x, y, 130, 50, 0xffffff, 0.9)
        .setStrokeStyle(2, 0x7b1fa2).setDepth(5);
      const label = this.add.text(x, y, '記憶にない', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#4a148c',
      }).setOrigin(0.5).setDepth(6);

      this.bubbles.push({
        bg,
        label,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    const dir = this.inputHandler.getDirection();
    this.player.x += dir.x * PLAYER_SPEED * dt;
    this.player.y += dir.y * PLAYER_SPEED * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 22, GAME_WIDTH - 22);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.areaTop + 22, this.areaBottom - 22);
    this.playerLabel.setPosition(this.player.x, this.player.y);

    this.bubbles.forEach(b => {
      b.bg.x += b.vx * dt;
      b.bg.y += b.vy * dt;
      b.label.setPosition(b.bg.x, b.bg.y);

      if (b.bg.x < 65 || b.bg.x > GAME_WIDTH - 65) b.vx *= -1;
      if (b.bg.y < this.areaTop + 25 || b.bg.y > this.areaBottom - 25) b.vy *= -1;

      const dx = b.bg.x - this.player.x;
      const dy = b.bg.y - this.player.y;
      if (Math.abs(dx) < 75 && Math.abs(dy) < 40) {
        this.endGame(false);
      }
    });
  }

  onTimeUp() {
    this.endGame(true);
  }
}
