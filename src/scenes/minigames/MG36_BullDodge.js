// MG36_BullDodge.js - パワハラを回避せよ！
// 操作: WASD移動
// 成功: 5秒生存 / 失敗: 吹き出しに接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 260;
const BUBBLES_DATA = [
  { text: '💢やれ！', color: 0xef5350 },
  { text: '💢失敗は\n許さん！', color: 0xe53935 },
  { text: '💢なぜ\nできない！', color: 0xd32f2f },
];

export default class MG36_BullDodge extends MiniGameBase {
  constructor() {
    super({ key: 'MG36_BullDodge' });
    this.gameTitle = 'パワハラを回避せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x3e2723).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '吹き出しから逃げろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffccbc',
    }).setOrigin(0.5);

    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;
    this.bubbles = [];
    super.create();
  }

  onGameStart() {
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 180, 22, 0xffe082)
      .setStrokeStyle(3, 0xffffff).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 180, '私', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#3e2723',
    }).setOrigin(0.5).setDepth(11);

    BUBBLES_DATA.forEach((b, i) => {
      const x = 60 + (i % 2) * (GAME_WIDTH - 120);
      const y = 180 + i * 160;
      const speed = 70 + Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;

      const bg = this.add.rectangle(x, y, 160, 80, b.color, 0.9)
        .setStrokeStyle(3, 0xffffff).setDepth(5);

      const label = this.add.text(x, y, b.text, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);

      // 膨張アニメ
      this.tweens.add({
        targets: [bg, label],
        scaleX: 1.12,
        scaleY: 1.12,
        duration: 600,
        yoyo: true,
        repeat: -1,
      });

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
      if (b.bg.y < this.areaTop + 40 || b.bg.y > this.areaBottom - 40) b.vy *= -1;

      const dx = Math.abs(b.bg.x - this.player.x);
      const dy = Math.abs(b.bg.y - this.player.y);
      if (dx < 100 && dy < 60) {
        this.endGame(false);
      }
    });
  }

  onTimeUp() {
    this.endGame(true);
  }
}
