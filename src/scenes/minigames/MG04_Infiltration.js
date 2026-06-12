// MG04_Infiltration.js - 内部調査をすり抜けろ！
// 操作: WASD/スワイプ移動
// 成功: 5秒間ライトを避ける / 失敗: ライトに照らされる

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 260;
const HALF_SPREAD = Math.PI / 7;
const LIGHT_RANGE = 260;
const GRACE_PERIOD = 1000;

export default class MG04_Infiltration extends MiniGameBase {
  constructor() {
    super({ key: 'MG04_Infiltration' });
    this.gameTitle = '内部調査を\nすり抜けろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x080818).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, 'ライトを避けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#aaaaff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.detected = false;
    super.create();
  }

  onGameStart() {
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 200, 18, 0x22aa66)
      .setStrokeStyle(2, 0xffffff).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 200, '📄', {
      fontSize: '16px',
    }).setOrigin(0.5).setDepth(11);

    this.graceTimer = GRACE_PERIOD;
    this.tweens.add({
      targets: this.player,
      alpha: { from: 0.3, to: 1 },
      duration: 200,
      repeat: Math.floor(GRACE_PERIOD / 400) - 1,
      yoyo: true,
      onComplete: () => { this.player.setAlpha(1); },
    });

    // スポットライト（位置・初期角度・回転速度）
    this.spotlights = [
      { x: 0,              y: GAME_HEIGHT * 0.35, angle: 0.3,           speed:  0.9 },
      { x: GAME_WIDTH,     y: GAME_HEIGHT * 0.55, angle: Math.PI + 0.3, speed: -0.7 },
      { x: GAME_WIDTH / 2, y: 100,                angle: Math.PI / 2,   speed:  1.1 },
    ];

    this.lightG = this.add.graphics().setDepth(5);
  }

  update(time, delta) {
    if (!this.isPlaying || this.detected) return;
    const dt = delta / 1000;

    if (this.graceTimer > 0) this.graceTimer -= delta;

    const dir = this.inputHandler.getDirection();
    this.player.x = Phaser.Math.Clamp(this.player.x + dir.x * PLAYER_SPEED * dt, 22, GAME_WIDTH - 22);
    this.player.y = Phaser.Math.Clamp(this.player.y + dir.y * PLAYER_SPEED * dt, 110, GAME_HEIGHT - 22);
    this.playerLabel.setPosition(this.player.x, this.player.y);

    this.lightG.clear();
    for (const s of this.spotlights) {
      s.angle += s.speed * dt;

      // コーン描画
      this.lightG.fillStyle(0xffff99, 0.22);
      this.lightG.beginPath();
      this.lightG.moveTo(s.x, s.y);
      for (let i = 0; i <= 16; i++) {
        const a = s.angle - HALF_SPREAD + (HALF_SPREAD * 2 * i / 16);
        this.lightG.lineTo(s.x + Math.cos(a) * LIGHT_RANGE, s.y + Math.sin(a) * LIGHT_RANGE);
      }
      this.lightG.closePath();
      this.lightG.fillPath();

      // 光源
      this.lightG.fillStyle(0xffffff, 0.9);
      this.lightG.fillCircle(s.x, s.y, 8);

      if (!this.detected && this.graceTimer <= 0 && this._hitTest(s)) {
        this.detected = true;
        this.cameras.main.flash(250, 255, 255, 50);
        this.time.delayedCall(300, () => this.endGame(false));
      }
    }
  }

  _hitTest(s) {
    const dx = this.player.x - s.x;
    const dy = this.player.y - s.y;
    if (Math.sqrt(dx * dx + dy * dy) > LIGHT_RANGE) return false;
    const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - s.angle);
    return Math.abs(diff) < HALF_SPREAD;
  }

  onTimeUp() {
    this.endGame(true);
  }
}
