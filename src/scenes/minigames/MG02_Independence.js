// MG02_Independence.js - 独立性を守れ！
// 仕様：5秒間、役職員に当たらず生き残る
// 操作：WASD移動 / スワイプ移動
// 成功：5秒生存 / 失敗：役職員に接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 280;
const ENEMY_COUNT = 5;
const ENEMY_APPROACH_SPEED = 70;

const ENEMY_KEYS = [
  'mg02_keiei',
  'mg02_yankee',
  'mg02_leader',
  'mg02_ayashii',
];

export default class MG02_Independence extends MiniGameBase {
  constructor() {
    super({ key: 'MG02_Independence' });
    this.gameTitle = '独立性を守れ！';
    this.gameDuration = 5;
  }

  preload() {
    this.load.image('mg02_player', 'illustration/job_businessman.png');
    this.load.image('mg02_keiei',  'illustration/business_oneman_keiei.png');
    this.load.image('mg02_yankee', 'illustration/mild_yankee_dqn.png');
    this.load.image('mg02_leader', 'illustration/leader_ibaru.png');
    this.load.image('mg02_ayashii','illustration/niyakeru_takuramu_ayashii_man.png');
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0a1a3a).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '役職員から逃げろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.areaTop = 100;
    this.areaBottom = GAME_HEIGHT - 40;

    super.create();
  }

  onGameStart() {
    this.playerPos = { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 150 };
    this.playerImg = this.add.image(this.playerPos.x, this.playerPos.y, 'mg02_player')
      .setDisplaySize(55, 80)
      .setDepth(5);

    this.enemies = [];
    for (let i = 0; i < ENEMY_COUNT; i++) {
      this.spawnEnemy(i);
    }
  }

  spawnEnemy(idx) {
    const side = idx % 4;
    let x, y;
    if (side === 0) {
      x = Math.random() * GAME_WIDTH;
      y = this.areaTop;
    } else if (side === 1) {
      x = GAME_WIDTH;
      y = this.areaTop + Math.random() * (this.areaBottom - this.areaTop);
    } else if (side === 2) {
      x = Math.random() * GAME_WIDTH;
      y = this.areaBottom;
    } else {
      x = 0;
      y = this.areaTop + Math.random() * (this.areaBottom - this.areaTop);
    }

    const key = ENEMY_KEYS[idx % ENEMY_KEYS.length];
    const img = this.add.image(x, y, key)
      .setDisplaySize(55, 80)
      .setDepth(5);

    this.enemies.push({ img, x, y });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    // プレイヤー移動
    const dir = this.inputHandler.getDirection();
    this.playerPos.x += dir.x * PLAYER_SPEED * dt;
    this.playerPos.y += dir.y * PLAYER_SPEED * dt;

    this.playerPos.x = Phaser.Math.Clamp(this.playerPos.x, 30, GAME_WIDTH - 30);
    this.playerPos.y = Phaser.Math.Clamp(this.playerPos.y, this.areaTop + 30, this.areaBottom - 30);
    this.playerImg.setPosition(this.playerPos.x, this.playerPos.y);

    // 敵：プレイヤーへゆっくり近づく
    this.enemies.forEach(e => {
      const dx = this.playerPos.x - e.x;
      const dy = this.playerPos.y - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        e.x += (dx / dist) * ENEMY_APPROACH_SPEED * dt;
        e.y += (dy / dist) * ENEMY_APPROACH_SPEED * dt;
      }

      e.x = Phaser.Math.Clamp(e.x, 30, GAME_WIDTH - 30);
      e.y = Phaser.Math.Clamp(e.y, this.areaTop + 30, this.areaBottom - 30);
      e.img.setPosition(e.x, e.y);

      // 衝突判定
      if (dist < 45) {
        this.endGame(false);
      }
    });
  }

  onTimeUp() {
    this.endGame(true);
  }
}
