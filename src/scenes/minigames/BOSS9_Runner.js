// BOSS9_Runner.js - 再発防止ロードマップ・ランナー
// 操作: クリックで上下移動（3レーン）
// 成功: 20アイテム収集 / 失敗: 障害物5回接触 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const LANE_Y = [250, 450, 650];
const SCROLL_SPEED = 200;
const SPAWN_INTERVAL = 700;
const ITEM_GOAL = 20;
const MAX_HIT = 5;

export default class BOSS9_Runner extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS9_Runner' });
    this.gameTitle = 'ロードマップ\nランナー！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1b3a4b).setOrigin(0);

    this.lane = 1; // 0=上, 1=中, 2=下
    this.collected = 0;
    this.hits = 0;
    this.obstacles = [];
    this.items = [];
    super.create();
  }

  onGameStart() {
    // プレイヤー
    this.player = this.add.text(80, LANE_Y[this.lane], '🏃', {
      fontSize: '40px',
    }).setOrigin(0.5).setDepth(10);

    // レーン線
    const g = this.add.graphics().setDepth(2);
    LANE_Y.forEach(y => {
      g.lineStyle(1, 0x37474f, 0.4);
      g.lineBetween(0, y + 40, GAME_WIDTH, y + 40);
    });

    // UI
    this.itemText = this.add.text(GAME_WIDTH / 2, 80, `⭐ 0/${ITEM_GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffee58',
    }).setOrigin(0.5).setDepth(20);

    this.hitText = this.add.text(GAME_WIDTH - 20, 80, `❌ 0/${MAX_HIT}`, {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ef5350',
    }).setOrigin(1, 0).setDepth(20);

    // レーン切替
    this.inputHandler.onClick((pointer) => {
      if (!this.isPlaying) return;
      if (pointer.y < GAME_HEIGHT / 3) {
        this.lane = Math.max(0, this.lane - 1);
      } else if (pointer.y > GAME_HEIGHT * 2 / 3) {
        this.lane = Math.min(2, this.lane + 1);
      }
    });

    // スポーン
    this.time.addEvent({
      delay: SPAWN_INTERVAL,
      repeat: -1,
      callback: () => {
        if (!this.isPlaying) return;
        this._spawnObject();
      },
    });
  }

  _spawnObject() {
    const lane = Math.floor(Math.random() * 3);
    const y = LANE_Y[lane];
    const isItem = Math.random() < 0.6;
    const emoji = isItem ? '⭐' : '❌';
    const speed = SCROLL_SPEED + Math.random() * 60;

    const obj = this.add.text(GAME_WIDTH + 30, y, emoji, {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(5);

    if (isItem) {
      this.items.push({ obj, lane, vx: -speed });
    } else {
      this.obstacles.push({ obj, lane, vx: -speed });
    }
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    // プレイヤーレーン追従
    const targetY = LANE_Y[this.lane];
    this.player.y += (targetY - this.player.y) * 0.2;

    // アイテム更新
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.obj.x += item.vx * dt;

      if (item.obj.x < -40) {
        item.obj.destroy();
        this.items.splice(i, 1);
        continue;
      }

      // 収集判定
      if (item.lane === this.lane && Math.abs(item.obj.x - this.player.x) < 40) {
        item.obj.destroy();
        this.items.splice(i, 1);
        this.collected++;
        this.itemText.setText(`⭐ ${this.collected}/${ITEM_GOAL}`);
        if (this.collected >= ITEM_GOAL) {
          this.endGame(true);
          return;
        }
      }
    }

    // 障害物更新
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.obj.x += obs.vx * dt;

      if (obs.obj.x < -40) {
        obs.obj.destroy();
        this.obstacles.splice(i, 1);
        continue;
      }

      if (obs.lane === this.lane && Math.abs(obs.obj.x - this.player.x) < 38 && !obs.hit) {
        obs.hit = true;
        obs.obj.destroy();
        this.obstacles.splice(i, 1);
        this.hits++;
        this.hitText.setText(`❌ ${this.hits}/${MAX_HIT}`);
        this.cameras.main.shake(100, 0.008);
        if (this.hits >= MAX_HIT) {
          this.endGame(false);
          return;
        }
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
