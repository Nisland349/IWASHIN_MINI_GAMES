// MG27_DataCatch.js - データ解析を急げ！
// 操作: クリック/タップで目標数字をキャッチ
// 成功: 3個キャッチ / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const TARGET_NUM = 99;
const CATCH_GOAL = 3;
const SPAWN_INTERVAL = 600;

export default class MG27_DataCatch extends MiniGameBase {
  constructor() {
    super({ key: 'MG27_DataCatch' });
    this.gameTitle = 'データ解析を急げ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0a0a2e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 60, `目標: ${TARGET_NUM}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#00ff88',
    }).setOrigin(0.5);

    this.caught = 0;
    this.numbers = [];
    super.create();
  }

  onGameStart() {
    this.catchText = this.add.text(GAME_WIDTH / 2, 100, `0 / ${CATCH_GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(20);

    this.time.addEvent({
      delay: SPAWN_INTERVAL,
      repeat: -1,
      callback: () => {
        if (!this.isPlaying) return;
        this._spawnNumber();
      },
    });

    // 初期スポーン
    for (let i = 0; i < 4; i++) {
      this._spawnNumber();
    }
  }

  _spawnNumber() {
    const isTarget = Math.random() < 0.3;
    const num = isTarget ? TARGET_NUM : this._randomNum();
    const x = 20 + Math.random() * (GAME_WIDTH - 40);
    const vy = 120 + Math.random() * 80;

    const txt = this.add.text(x, 130, String(num), {
      fontFamily: 'monospace',
      fontSize: isTarget ? '28px' : '22px',
      fontStyle: 'bold',
      color: isTarget ? '#00ff88' : '#607d8b',
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

    const numObj = { obj: txt, vy, isTarget };
    this.numbers.push(numObj);

    txt.on('pointerdown', () => {
      if (!this.isPlaying || !txt.active) return;
      if (numObj.isTarget) {
        txt.destroy();
        const idx = this.numbers.indexOf(numObj);
        if (idx !== -1) this.numbers.splice(idx, 1);
        this.caught++;
        this.catchText.setText(`${this.caught} / ${CATCH_GOAL}`);
        if (this.caught >= CATCH_GOAL) {
          this.time.delayedCall(300, () => this.endGame(true));
        }
      }
    });
  }

  _randomNum() {
    let n;
    do { n = Math.floor(Math.random() * 990) + 10; } while (n === TARGET_NUM);
    return n;
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    for (let i = this.numbers.length - 1; i >= 0; i--) {
      const n = this.numbers[i];
      if (!n.obj.active) { this.numbers.splice(i, 1); continue; }
      n.obj.y += n.vy * dt;
      if (n.obj.y > GAME_HEIGHT + 30) {
        n.obj.destroy();
        this.numbers.splice(i, 1);
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
