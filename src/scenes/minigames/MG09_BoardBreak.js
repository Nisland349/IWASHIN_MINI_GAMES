// MG09_BoardBreak.js - 常務会を突破せよ！
// 操作: WASD/スワイプ移動
// 成功: 役員の隙間を通り抜けてゴールへ / 失敗: 役員に接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 300;
const PLAYER_R = 22;
const EXEC_R = 30;
const GOAL_Y = 220;

export default class MG09_BoardBreak extends MiniGameBase {
  constructor() {
    super({ key: 'MG09_BoardBreak' });
    this.gameTitle = '常務会を突破せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '役員をすり抜けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.hit = false;
    super.create();
  }

  onGameStart() {
    // ゴールゾーン
    this.add.rectangle(0, GOAL_Y - 30, GAME_WIDTH, 60, 0x1565c0, 0.4).setOrigin(0);
    this.add.text(GAME_WIDTH / 2, GOAL_Y, '会議室 →', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#88aaff',
    }).setOrigin(0.5);

    // 役員ブロック（1列、左右パトロール）
    const row1Y = 500;
    const row2Y = 360;
    this.executives = [];

    // 行1: 右方向
    [65, 195, 325].forEach(x => {
      this._addExec(x, row1Y, 75);
    });

    // 行2: 左方向
    [65, 195, 325].forEach(x => {
      this._addExec(x, row2Y, -90);
    });

    // プレイヤー
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 120, PLAYER_R, 0xffcc00)
      .setStrokeStyle(3, 0xffffff).setDepth(10);
    this.playerLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 120, '独', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#222222',
    }).setOrigin(0.5).setDepth(11);
  }

  _addExec(x, y, speed) {
    const circle = this.add.circle(x, y, EXEC_R, 0xcc3344)
      .setStrokeStyle(2, 0xffffff).setDepth(8);
    const label = this.add.text(x, y, '役', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(9);
    this.executives.push({ circle, label, vx: speed });
  }

  update(time, delta) {
    if (!this.isPlaying || this.hit) return;
    const dt = delta / 1000;

    const dir = this.inputHandler.getDirection();
    this.player.x = Phaser.Math.Clamp(this.player.x + dir.x * PLAYER_SPEED * dt, PLAYER_R, GAME_WIDTH - PLAYER_R);
    this.player.y = Phaser.Math.Clamp(this.player.y + dir.y * PLAYER_SPEED * dt, 110, GAME_HEIGHT - PLAYER_R);
    this.playerLabel.setPosition(this.player.x, this.player.y);

    // ゴール到達
    if (this.player.y < GOAL_Y) {
      this.endGame(true);
      return;
    }

    for (const e of this.executives) {
      e.circle.x += e.vx * dt;
      e.label.setPosition(e.circle.x, e.circle.y);

      if (e.circle.x < EXEC_R || e.circle.x > GAME_WIDTH - EXEC_R) e.vx *= -1;

      const dx = e.circle.x - this.player.x;
      const dy = e.circle.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < EXEC_R + PLAYER_R) {
        this.hit = true;
        this.cameras.main.flash(200, 255, 50, 50);
        this.time.delayedCall(300, () => this.endGame(false));
        return;
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
