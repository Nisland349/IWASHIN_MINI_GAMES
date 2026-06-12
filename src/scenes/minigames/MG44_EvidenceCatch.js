// MG44_EvidenceCatch.js - 証拠を守れ！
// 操作: キャッチャーをWASD左右移動
// 成功: 5個中3個キャッチ / 失敗: キャッチ数3未満で時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CATCHER_SPEED = 320;
const EVIDENCE_COUNT = 5;
const CATCH_GOAL = 3;
const SPAWN_INTERVAL = 800;

export default class MG44_EvidenceCatch extends MiniGameBase {
  constructor() {
    super({ key: 'MG44_EvidenceCatch' });
    this.gameTitle = '証拠を守れ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0a1628).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `証拠を${CATCH_GOAL}個以上キャッチ！`, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#90caf9',
    }).setOrigin(0.5);

    this.caught = 0;
    this.evidences = [];
    this.spawnCount = 0;
    super.create();
  }

  onGameStart() {
    // キャッチャー
    this.catcher = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 140, 25, 0x42a5f5)
      .setStrokeStyle(3, 0x1565c0).setDepth(10);

    // スコア表示
    this.catchText = this.add.text(GAME_WIDTH / 2, 110, `0 / ${CATCH_GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#69f0ae',
    }).setOrigin(0.5).setDepth(20);

    // 証拠スポーン
    this.time.addEvent({
      delay: SPAWN_INTERVAL,
      repeat: EVIDENCE_COUNT - 1,
      callback: () => {
        if (!this.isPlaying) return;
        this._spawnEvidence();
      },
    });
    this._spawnEvidence();
  }

  _spawnEvidence() {
    const x = 30 + Math.random() * (GAME_WIDTH - 60);
    const evidence = this.add.text(x, 130, '📁', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(5);
    this.evidences.push({ obj: evidence, vy: 180 + Math.random() * 60, caught: false });
    this.spawnCount++;
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    // キャッチャー移動
    const dir = this.inputHandler.getDirection();
    this.catcher.x += dir.x * CATCHER_SPEED * dt;
    this.catcher.x = Phaser.Math.Clamp(this.catcher.x, 70, GAME_WIDTH - 70);

    for (let i = this.evidences.length - 1; i >= 0; i--) {
      const e = this.evidences[i];
      if (e.caught || !e.obj.active) continue;

      e.obj.y += e.vy * dt;

      if (e.obj.y >= GAME_HEIGHT - 72) {
        const dx = Math.abs(e.obj.x - this.catcher.x);
        if (dx < 80) {
          // キャッチ！
          e.caught = true;
          e.obj.destroy();
          this.caught++;
          this.catchText.setText(`${this.caught} / ${CATCH_GOAL}`);
          if (this.caught >= CATCH_GOAL) {
            this.time.delayedCall(300, () => this.endGame(true));
          }
        } else {
          e.caught = true;
          this.tweens.add({
            targets: e.obj,
            alpha: 0,
            duration: 200,
            onComplete: () => e.obj.destroy(),
          });
        }
      }
    }
  }

  onTimeUp() {
    if (this.caught >= CATCH_GOAL) {
      this.endGame(true);
    } else {
      this.endGame(false);
    }
  }
}
