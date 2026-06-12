// MG59_EvasiveDodge.js - かわしセリフを避けろ！
// 操作: WASD移動
// 成功: 5秒生存 / 失敗: 吹き出しに接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 270;
const BUBBLES_DATA = [
  '記憶にない',
  '存じません',
  '確認します',
  '把握しておりません',
  '検討中です',
];

export default class MG59_EvasiveDodge extends MiniGameBase {
  constructor() {
    super({ key: 'MG59_EvasiveDodge' });
    this.gameTitle = 'かわしセリフを\n避けろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a0030).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '逃げ言葉を避けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ce93d8',
    }).setOrigin(0.5);

    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;
    this.bubbles = [];
    super.create();
  }

  onGameStart() {
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 200, 20, 0xab47bc)
      .setStrokeStyle(3, 0xffffff).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 200, '私', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(11);

    BUBBLES_DATA.forEach((text, i) => {
      let x, y;
      do {
        x = 80 + Math.random() * (GAME_WIDTH - 160);
        y = this.areaTop + 60 + Math.random() * (this.areaBottom - this.areaTop - 120);
      } while (Math.abs(x - this.player.x) < 80 && Math.abs(y - this.player.y) < 80);

      const speed = 80 + Math.random() * 70;
      const angle = Math.random() * Math.PI * 2;

      const bg = this.add.rectangle(x, y, 160, 52, 0x6a1b9a, 0.9)
        .setStrokeStyle(2, 0xba68c8).setDepth(5);
      const label = this.add.text(x, y, text, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#e1bee7',
      }).setOrigin(0.5).setDepth(6);

      this.bubbles.push({
        bg,
        label,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    });
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

      if (b.bg.x < 80 || b.bg.x > GAME_WIDTH - 80) b.vx *= -1;
      if (b.bg.y < this.areaTop + 26 || b.bg.y > this.areaBottom - 26) b.vy *= -1;

      const dx = Math.abs(b.bg.x - this.player.x);
      const dy = Math.abs(b.bg.y - this.player.y);
      if (dx < 90 && dy < 42) {
        this.endGame(false);
      }
    });
  }

  onTimeUp() {
    this.endGame(true);
  }
}
