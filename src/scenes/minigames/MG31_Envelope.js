// MG31_Envelope.js - 資金を届けろ！
// 操作: WASD移動で障害物を避けてゴールへ
// 成功: 右端に到達 / 失敗: 障害物接触 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 250;
const OBSTACLES = [
  { x: 150, y: 300 },
  { x: 230, y: 480 },
  { x: 280, y: 220 },
  { x: 170, y: 600 },
];
const GOAL_X = GAME_WIDTH - 40;

export default class MG31_Envelope extends MiniGameBase {
  constructor() {
    super({ key: 'MG31_Envelope' });
    this.gameTitle = '資金を届けろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xe0f2f1).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '右端のゴールへ届けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#004d40',
    }).setOrigin(0.5);

    this.obstacleObjs = [];
    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;
    super.create();
  }

  onGameStart() {
    // 障害物
    OBSTACLES.forEach(obs => {
      const bg = this.add.rectangle(obs.x, obs.y, 55, 55, 0xef5350)
        .setStrokeStyle(3, 0xb71c1c).setDepth(5);
      this.add.text(obs.x, obs.y, '✕', {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(6);
      this.obstacleObjs.push(bg);
    });

    // ゴール
    const g = this.add.graphics();
    g.fillStyle(0x26c6da, 0.4);
    g.fillRect(GOAL_X - 30, this.areaTop, 60, this.areaBottom - this.areaTop);
    g.lineStyle(3, 0x00838f, 1);
    g.strokeRect(GOAL_X - 30, this.areaTop, 60, this.areaBottom - this.areaTop);
    this.add.text(GOAL_X, GAME_HEIGHT / 2, '到着\n🏁', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#006064',
      align: 'center',
    }).setOrigin(0.5);

    // プレイヤー（封筒）
    this.player = this.add.text(40, GAME_HEIGHT / 2, '💰', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(10);
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    const dir = this.inputHandler.getDirection();
    this.player.x += dir.x * PLAYER_SPEED * dt;
    this.player.y += dir.y * PLAYER_SPEED * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, GAME_WIDTH - 20);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.areaTop + 20, this.areaBottom - 20);

    // ゴール判定
    if (this.player.x >= GOAL_X - 30) {
      this.endGame(true);
      return;
    }

    // 障害物衝突
    for (const obs of this.obstacleObjs) {
      const dx = Math.abs(obs.x - this.player.x);
      const dy = Math.abs(obs.y - this.player.y);
      if (dx < 44 && dy < 44) {
        this.cameras.main.shake(200, 0.01);
        this.endGame(false);
        return;
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
