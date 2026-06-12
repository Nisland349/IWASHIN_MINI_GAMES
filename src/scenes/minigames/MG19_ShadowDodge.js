// MG19_ShadowDodge.js - 影響力を排除せよ！（移動回避版）
// 操作: WASD移動
// 成功: 5秒生存 / 失敗: 影に接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 270;
const SHADOW_COUNT = 4;

export default class MG19_ShadowDodge extends MiniGameBase {
  constructor() {
    super({ key: 'MG19_ShadowDodge' });
    this.gameTitle = '影響力を排除せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x212121).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '影から逃げろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#bdbdbd',
    }).setOrigin(0.5);

    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;
    this.shadows = [];
    super.create();
  }

  onGameStart() {
    // プレイヤー（黄色円）
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 200, 20, 0xffee58)
      .setStrokeStyle(3, 0xffffff).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 200, '私', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#212121',
    }).setOrigin(0.5).setDepth(11);

    // 影オブジェクト
    for (let i = 0; i < SHADOW_COUNT; i++) {
      let x, y;
      do {
        x = 30 + Math.random() * (GAME_WIDTH - 60);
        y = this.areaTop + 30 + Math.random() * (this.areaBottom - this.areaTop - 60);
      } while (
        Math.abs(x - this.player.x) < 80 && Math.abs(y - this.player.y) < 80
      );

      const speed = 80 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      const shadow = this.add.circle(x, y, 30, 0x000000, 0.6)
        .setStrokeStyle(2, 0x424242).setDepth(5);
      this.add.text(x, y, '影', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#757575',
      }).setOrigin(0.5).setDepth(6);

      this.shadows.push({
        obj: shadow,
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

    this.shadows.forEach(s => {
      s.obj.x += s.vx * dt;
      s.obj.y += s.vy * dt;

      if (s.obj.x < 30 || s.obj.x > GAME_WIDTH - 30) s.vx *= -1;
      if (s.obj.y < this.areaTop + 30 || s.obj.y > this.areaBottom - 30) s.vy *= -1;

      const dx = s.obj.x - this.player.x;
      const dy = s.obj.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < 48) {
        this.endGame(false);
      }
    });
  }

  onTimeUp() {
    this.endGame(true);
  }
}
