// MG35_ArrowDodge.js - 上意下達を避けろ！
// 操作: WASD左右移動
// 成功: 5秒生存 / 失敗: 矢印に接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 300;
const ARROW_INTERVAL = 900;

export default class MG35_ArrowDodge extends MiniGameBase {
  constructor() {
    super({ key: 'MG35_ArrowDodge' });
    this.gameTitle = '上意下達を避けろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d0d0d).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '↓ を避けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#ff5252',
    }).setOrigin(0.5);

    this.arrows = [];
    this.areaBottom = GAME_HEIGHT - 60;
    super.create();
  }

  onGameStart() {
    this.player = this.add.rectangle(GAME_WIDTH / 2, this.areaBottom - 20, 50, 50, 0x42a5f5)
      .setStrokeStyle(3, 0x1565c0).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, this.areaBottom - 20, '私', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(11);

    this.time.addEvent({
      delay: ARROW_INTERVAL,
      repeat: -1,
      callback: () => {
        if (!this.isPlaying) return;
        this._spawnArrow();
      },
    });
    this._spawnArrow();
  }

  _spawnArrow() {
    const x = 30 + Math.random() * (GAME_WIDTH - 60);
    const arrow = this.add.text(x, 120, '↓', {
      fontFamily: 'sans-serif',
      fontSize: '50px',
      fontStyle: 'bold',
      color: '#ff1744',
      stroke: '#b71c1c',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(5);

    this.arrows.push({ obj: arrow, vy: 380 });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    const dir = this.inputHandler.getDirection();
    this.player.x += dir.x * PLAYER_SPEED * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 27, GAME_WIDTH - 27);
    this.playerLabel.setX(this.player.x);

    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const a = this.arrows[i];
      a.obj.y += a.vy * dt;

      if (a.obj.y > GAME_HEIGHT + 60) {
        a.obj.destroy();
        this.arrows.splice(i, 1);
        continue;
      }

      const dx = Math.abs(a.obj.x - this.player.x);
      const dy = Math.abs(a.obj.y - this.player.y);
      if (dx < 45 && dy < 45) {
        this.endGame(false);
        return;
      }
    }
  }

  onTimeUp() {
    this.endGame(true);
  }
}
