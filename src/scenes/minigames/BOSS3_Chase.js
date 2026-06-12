// BOSS3_Chase.js - 資料隠滅チェイス
// 操作: WASD移動でHDDを収集
// 成功: 10個収集 / 失敗: ハンマーに接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 260;
const HAMMER_SPEED = 100;
const COLLECT_GOAL = 10;

export default class BOSS3_Chase extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS3_Chase' });
    this.gameTitle = '資料隠滅チェイス！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1b2631).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, 'HDDを10個集めろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#aed6f1',
    }).setOrigin(0.5);

    this.collected = 0;
    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;
    this.hdds = [];
    super.create();
  }

  onGameStart() {
    // プレイヤー
    this.player = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '🏃', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(10);

    // スコア表示
    this.scoreText = this.add.text(GAME_WIDTH / 2, 100, `0 / ${COLLECT_GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#f1c40f',
    }).setOrigin(0.5).setDepth(20);

    // ハンマー（追跡）
    this.hammer = this.add.text(50, 200, '🔨', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(8);

    // 最初のHDDを5個配置
    for (let i = 0; i < 5; i++) {
      this._spawnHDD();
    }
  }

  _spawnHDD() {
    let x, y;
    do {
      x = 30 + Math.random() * (GAME_WIDTH - 60);
      y = this.areaTop + 30 + Math.random() * (this.areaBottom - this.areaTop - 60);
    } while (
      this.player &&
      Math.abs(x - this.player.x) < 60 && Math.abs(y - this.player.y) < 60
    );

    const hdd = this.add.text(x, y, '💾', {
      fontSize: '32px',
    }).setOrigin(0.5).setDepth(5);
    this.hdds.push(hdd);
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    // プレイヤー移動
    const dir = this.inputHandler.getDirection();
    this.player.x += dir.x * PLAYER_SPEED * dt;
    this.player.y += dir.y * PLAYER_SPEED * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, GAME_WIDTH - 20);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.areaTop + 20, this.areaBottom - 20);

    // ハンマー追跡
    const hx = this.player.x - this.hammer.x;
    const hy = this.player.y - this.hammer.y;
    const hd = Math.sqrt(hx * hx + hy * hy);
    if (hd > 1) {
      this.hammer.x += (hx / hd) * HAMMER_SPEED * dt;
      this.hammer.y += (hy / hd) * HAMMER_SPEED * dt;
    }

    // ハンマー衝突
    if (Math.abs(this.player.x - this.hammer.x) < 35 && Math.abs(this.player.y - this.hammer.y) < 35) {
      this.endGame(false);
      return;
    }

    // HDD収集
    for (let i = this.hdds.length - 1; i >= 0; i--) {
      const h = this.hdds[i];
      const dx = h.x - this.player.x;
      const dy = h.y - this.player.y;
      if (Math.abs(dx) < 35 && Math.abs(dy) < 35) {
        h.destroy();
        this.hdds.splice(i, 1);
        this.collected++;
        this.scoreText.setText(`${this.collected} / ${COLLECT_GOAL}`);

        if (this.collected >= COLLECT_GOAL) {
          this.endGame(true);
          return;
        }
        this._spawnHDD();
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
