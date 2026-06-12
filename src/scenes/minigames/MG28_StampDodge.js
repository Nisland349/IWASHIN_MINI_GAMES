// MG28_StampDodge.js - 償却済みを避けろ！
// 操作: 左右WASD移動
// 成功: 5秒生存 / 失敗: スタンプに接触

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PLAYER_SPEED = 300;
const STAMP_INTERVAL = 1200;

export default class MG28_StampDodge extends MiniGameBase {
  constructor() {
    super({ key: 'MG28_StampDodge' });
    this.gameTitle = '償却済みを避けろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff9c4).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '赤いスタンプを避けろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#b71c1c',
    }).setOrigin(0.5);

    this.stamps = [];
    this.areaBottom = GAME_HEIGHT - 60;
    super.create();
  }

  onGameStart() {
    // プレイヤー
    this.player = this.add.rectangle(GAME_WIDTH / 2, this.areaBottom - 20, 50, 50, 0x1565c0)
      .setStrokeStyle(3, 0x0d47a1).setDepth(10);
    this.add.text(GAME_WIDTH / 2, this.areaBottom - 20, '私', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(11);
    this.playerLabel = this.children.list[this.children.list.length - 1];

    // スタンプ生成イベント
    this.time.addEvent({
      delay: STAMP_INTERVAL,
      repeat: -1,
      callback: () => {
        if (!this.isPlaying) return;
        this._spawnStamp();
      },
    });
    this._spawnStamp();
  }

  _spawnStamp() {
    const x = 30 + Math.random() * (GAME_WIDTH - 60);
    const stamp = this.add.rectangle(x, 130, 110, 45, 0xd32f2f)
      .setStrokeStyle(3, 0xb71c1c).setDepth(5);
    this.add.text(x, 130, '償却済', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(6);
    const label = this.children.list[this.children.list.length - 1];

    this.stamps.push({ bg: stamp, label, vy: 220 });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    const dir = this.inputHandler.getDirection();
    this.player.x += dir.x * PLAYER_SPEED * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 28, GAME_WIDTH - 28);
    if (this.playerLabel) this.playerLabel.setX(this.player.x);

    for (let i = this.stamps.length - 1; i >= 0; i--) {
      const s = this.stamps[i];
      s.bg.y += s.vy * dt;
      s.label.y = s.bg.y;

      if (s.bg.y > GAME_HEIGHT + 30) {
        s.bg.destroy();
        s.label.destroy();
        this.stamps.splice(i, 1);
        continue;
      }

      const dx = Math.abs(s.bg.x - this.player.x);
      const dy = Math.abs(s.bg.y - this.player.y);
      if (dx < 75 && dy < 42) {
        this.endGame(false);
        return;
      }
    }
  }

  onTimeUp() {
    this.endGame(true);
  }
}
