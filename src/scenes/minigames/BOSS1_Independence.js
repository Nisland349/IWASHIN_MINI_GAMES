// BOSS1_Independence.js - 独立性ディフェンス（アンダイン風）
// 操作: WASD / スワイプで盾の向きを変えて槍を防ぐ
// 成功: 30秒生き残る / 失敗: HP=0

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const ARENA_W = 270;
const ARENA_H = 270;
const ARENA_X = (GAME_WIDTH - ARENA_W) / 2;
const ARENA_Y = 310;
const CENTER_X = GAME_WIDTH / 2;
const CENTER_Y = ARENA_Y + ARENA_H / 2;

const MAX_HP = 3;
const SPEAR_SPEED_INIT = 280;
const SPEAR_SPEED_MAX = 560;
const SPAWN_INTERVAL_INIT = 1800;
const SPAWN_INTERVAL_MIN = 650;
const TELEGRAPH_MS = 380;

const DIR_UP    = 0;
const DIR_RIGHT = 1;
const DIR_DOWN  = 2;
const DIR_LEFT  = 3;

export default class BOSS1_Independence extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS1_Independence' });
    this.gameTitle = '独立性ディフェンス！';
    this.gameDuration = 30;
  }

  create() {
    this.hp = MAX_HP;
    this.shieldDir = DIR_UP;
    this.spears = [];
    this.invincible = false;
    this.elapsed = 0;

    this._drawBackground();
    this._drawArena();
    this._createPlayer();
    this._createShield();
    this._drawHPDisplay();
    this._drawInstructions();

    super.create();
  }

  onGameStart() {
    this._setupInput();
    this._startSpawner();
  }

  // ─── 描画 ────────────────────────────────────────────

  _drawBackground() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x060614).setOrigin(0);

    // 背景の星
    const starG = this.add.graphics().setDepth(0);
    starG.fillStyle(0xffffff, 0.35);
    for (let i = 0; i < 60; i++) {
      starG.fillCircle(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT,
        Math.random() * 1.5
      );
    }
  }

  _drawArena() {
    const g = this.add.graphics().setDepth(1);

    // アリーナ内部
    g.fillStyle(0x120a28);
    g.fillRect(ARENA_X, ARENA_Y, ARENA_W, ARENA_H);

    // 外枠
    g.lineStyle(4, 0x7755dd);
    g.strokeRect(ARENA_X, ARENA_Y, ARENA_W, ARENA_H);

    // 角の装飾
    g.lineStyle(4, 0xbb99ff);
    const CL = 20;
    const corners = [
      [ARENA_X, ARENA_Y, 1, 1],
      [ARENA_X + ARENA_W, ARENA_Y, -1, 1],
      [ARENA_X, ARENA_Y + ARENA_H, 1, -1],
      [ARENA_X + ARENA_W, ARENA_Y + ARENA_H, -1, -1],
    ];
    for (const [cx, cy, dx, dy] of corners) {
      g.beginPath();
      g.moveTo(cx + dx * CL, cy);
      g.lineTo(cx, cy);
      g.lineTo(cx, cy + dy * CL);
      g.strokePath();
    }
  }

  _createPlayer() {
    this.playerG = this.add.graphics().setDepth(5);
    this._drawHeart(0xff2244);
  }

  _drawHeart(color) {
    this.playerG.clear();
    this.playerG.fillStyle(color);
    const x = CENTER_X;
    const y = CENTER_Y;
    const s = 12;
    // Phaser3 の Graphics に bezierCurveTo がないため 2円＋三角形でハート近似
    this.playerG.fillCircle(x - s * 0.5, y - s * 0.15, s * 0.62);
    this.playerG.fillCircle(x + s * 0.5, y - s * 0.15, s * 0.62);
    this.playerG.fillTriangle(
      x - s * 1.05, y - s * 0.05,
      x + s * 1.05, y - s * 0.05,
      x,            y + s * 0.9
    );
  }

  _createShield() {
    this.shieldG = this.add.graphics().setDepth(6);
    this._redrawShield();
  }

  _redrawShield() {
    this.shieldG.clear();

    const SW = 48;  // 盾の長さ
    const ST = 11;  // 盾の厚さ
    const SD = 22;  // 中心からの距離

    this.shieldG.fillStyle(0x22bbff, 0.92);
    this.shieldG.lineStyle(2, 0xffffff, 0.7);

    const x = CENTER_X;
    const y = CENTER_Y;
    let rx, ry, rw, rh;

    if (this.shieldDir === DIR_UP) {
      rx = x - SW / 2; ry = y - SD - ST; rw = SW; rh = ST;
    } else if (this.shieldDir === DIR_RIGHT) {
      rx = x + SD;      ry = y - SW / 2; rw = ST; rh = SW;
    } else if (this.shieldDir === DIR_DOWN) {
      rx = x - SW / 2; ry = y + SD;      rw = SW; rh = ST;
    } else {
      rx = x - SD - ST; ry = y - SW / 2; rw = ST; rh = SW;
    }

    this.shieldG.fillRect(rx, ry, rw, rh);
    this.shieldG.strokeRect(rx, ry, rw, rh);
  }

  _drawHPDisplay() {
    this.hpText = this.add.text(ARENA_X, ARENA_Y - 38, '', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#ff4466',
    }).setDepth(10);
    this._updateHP();

    this.add.text(ARENA_X + ARENA_W, ARENA_Y - 38, '30秒耐えろ！', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#8888bb',
    }).setOrigin(1, 0).setDepth(10);
  }

  _updateHP() {
    this.hpText.setText('♥'.repeat(this.hp) + '♡'.repeat(MAX_HP - this.hp));
  }

  _drawInstructions() {
    this.add.text(GAME_WIDTH / 2, ARENA_Y + ARENA_H + 28, 'WASD / スワイプ → 盾の向きを変えろ！', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#7777aa',
    }).setOrigin(0.5).setDepth(10);
  }

  // ─── 入力 ────────────────────────────────────────────

  _setupInput() {
    this.input.keyboard.on('keydown', (event) => {
      if (!this.isPlaying) return;
      switch (event.key) {
        case 'w': case 'W': case 'ArrowUp':    this._setShield(DIR_UP);    break;
        case 'd': case 'D': case 'ArrowRight': this._setShield(DIR_RIGHT); break;
        case 's': case 'S': case 'ArrowDown':  this._setShield(DIR_DOWN);  break;
        case 'a': case 'A': case 'ArrowLeft':  this._setShield(DIR_LEFT);  break;
      }
    });

    this.inputHandler.onSwipe('up',    () => { if (this.isPlaying) this._setShield(DIR_UP);    });
    this.inputHandler.onSwipe('right', () => { if (this.isPlaying) this._setShield(DIR_RIGHT); });
    this.inputHandler.onSwipe('down',  () => { if (this.isPlaying) this._setShield(DIR_DOWN);  });
    this.inputHandler.onSwipe('left',  () => { if (this.isPlaying) this._setShield(DIR_LEFT);  });
  }

  _setShield(dir) {
    this.shieldDir = dir;
    this._redrawShield();
  }

  // ─── スポーン ─────────────────────────────────────────

  _startSpawner() {
    let interval = SPAWN_INTERVAL_INIT;

    const spawnLoop = () => {
      if (!this.isPlaying) return;
      this._telegraphAndSpawn();
      interval = Math.max(SPAWN_INTERVAL_MIN, interval - 55);
      this.time.delayedCall(interval, spawnLoop);
    };

    this.time.delayedCall(1000, spawnLoop);
  }

  _telegraphAndSpawn() {
    const side = Phaser.Math.Between(0, 3);

    // 壁フラッシュ（予告）
    const flashG = this.add.graphics().setDepth(3);
    flashG.lineStyle(6, 0xff6600, 1.0);
    if      (side === DIR_UP)    flashG.lineBetween(ARENA_X,          ARENA_Y,          ARENA_X + ARENA_W, ARENA_Y);
    else if (side === DIR_RIGHT) flashG.lineBetween(ARENA_X + ARENA_W, ARENA_Y,          ARENA_X + ARENA_W, ARENA_Y + ARENA_H);
    else if (side === DIR_DOWN)  flashG.lineBetween(ARENA_X,          ARENA_Y + ARENA_H, ARENA_X + ARENA_W, ARENA_Y + ARENA_H);
    else                         flashG.lineBetween(ARENA_X,          ARENA_Y,           ARENA_X,           ARENA_Y + ARENA_H);

    this.tweens.add({
      targets: flashG,
      alpha: 0,
      duration: TELEGRAPH_MS,
      onComplete: () => flashG.destroy(),
    });

    this.time.delayedCall(TELEGRAPH_MS, () => {
      if (!this.isPlaying) return;
      this._spawnSpear(side);
    });
  }

  _spawnSpear(side) {
    const progress = Math.min(this.elapsed / this.gameDuration, 1);
    const speed = SPEAR_SPEED_INIT + (SPEAR_SPEED_MAX - SPEAR_SPEED_INIT) * progress;

    const margin = 34;
    const pos = margin + Math.random() * (ARENA_W - margin * 2);

    let sx, sy, vx, vy;
    if (side === DIR_UP)    { sx = ARENA_X + pos;          sy = ARENA_Y - 30;          vx =  0;      vy =  speed; }
    else if (side === DIR_RIGHT) { sx = ARENA_X + ARENA_W + 30; sy = ARENA_Y + pos;          vx = -speed;  vy =  0;     }
    else if (side === DIR_DOWN)  { sx = ARENA_X + pos;          sy = ARENA_Y + ARENA_H + 30; vx =  0;      vy = -speed; }
    else                         { sx = ARENA_X - 30;           sy = ARENA_Y + pos;          vx =  speed;  vy =  0;     }

    const g = this._createSpearGraphics(side);
    g.x = sx;
    g.y = sy;

    this.spears.push({ g, x: sx, y: sy, vx, vy, side, done: false });
  }

  _createSpearGraphics(side) {
    const g = this.add.graphics().setDepth(7);
    const L = 30;
    const W = 8;
    const TIP = 14;

    g.fillStyle(0xffdd00);
    g.lineStyle(1, 0xff9900);

    // 進行方向の先端を尖らせる（ローカル座標）
    if (side === DIR_UP) {            // 下向き（上から来る）
      g.fillRect(-W / 2, -L / 2, W, L);
      g.fillTriangle(-W / 2, L / 2, W / 2, L / 2, 0, L / 2 + TIP);
    } else if (side === DIR_RIGHT) { // 左向き（右から来る）
      g.fillRect(-L / 2, -W / 2, L, W);
      g.fillTriangle(-L / 2, -W / 2, -L / 2, W / 2, -L / 2 - TIP, 0);
    } else if (side === DIR_DOWN) {  // 上向き（下から来る）
      g.fillRect(-W / 2, -L / 2, W, L);
      g.fillTriangle(-W / 2, -L / 2, W / 2, -L / 2, 0, -L / 2 - TIP);
    } else {                         // 右向き（左から来る）
      g.fillRect(-L / 2, -W / 2, L, W);
      g.fillTriangle(L / 2, -W / 2, L / 2, W / 2, L / 2 + TIP, 0);
    }

    return g;
  }

  // ─── ゲームループ ─────────────────────────────────────

  update(time, delta) {
    if (!this.isPlaying) return;
    this.elapsed += delta / 1000;

    for (const spear of this.spears) {
      if (spear.done) continue;

      const dt = delta / 1000;
      spear.x += spear.vx * dt;
      spear.y += spear.vy * dt;
      spear.g.x = spear.x;
      spear.g.y = spear.y;

      // アリーナ外に出たら削除
      if (
        spear.x < ARENA_X - 100 || spear.x > ARENA_X + ARENA_W + 100 ||
        spear.y < ARENA_Y - 100 || spear.y > ARENA_Y + ARENA_H + 100
      ) {
        spear.done = true;
        spear.g.destroy();
        continue;
      }

      // プレイヤーとの衝突
      if (Math.hypot(spear.x - CENTER_X, spear.y - CENTER_Y) < 30) {
        spear.done = true;
        spear.g.destroy();

        if (this.shieldDir === spear.side) {
          this._onBlocked(spear.x, spear.y);
        } else if (!this.invincible) {
          this._onHit();
        }
      }
    }

    this.spears = this.spears.filter(s => !s.done);
  }

  // ─── ヒット・ブロック ──────────────────────────────────

  _onBlocked(bx, by) {
    const spark = this.add.graphics().setDepth(9);
    spark.fillStyle(0xffffff, 0.9);
    spark.fillCircle(0, 0, 14);
    spark.x = bx;
    spark.y = by;
    this.tweens.add({
      targets: spark,
      scaleX: 3.5,
      scaleY: 3.5,
      alpha: 0,
      duration: 220,
      onComplete: () => spark.destroy(),
    });

    const txt = this.add.text(bx, by - 20, 'BLOCK!', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#44ffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({
      targets: txt,
      y: by - 55,
      alpha: 0,
      duration: 500,
      onComplete: () => txt.destroy(),
    });
  }

  _onHit() {
    this.invincible = true;
    this.hp = Math.max(0, this.hp - 1);
    this._updateHP();
    this.cameras.main.shake(160, 0.022);

    // ハートを赤白点滅
    let toggle = false;
    const flashTimer = this.time.addEvent({
      delay: 80,
      repeat: 5,
      callback: () => {
        this._drawHeart(toggle ? 0xffffff : 0xff2244);
        toggle = !toggle;
      },
    });

    this.time.delayedCall(560, () => {
      this._drawHeart(0xff2244);
      this.invincible = false;
      flashTimer.remove();
    });

    if (this.hp <= 0) {
      this.time.delayedCall(350, () => this.endGame(false));
    }
  }

  onTimeUp() {
    this.endGame(this.hp > 0);
  }
}
