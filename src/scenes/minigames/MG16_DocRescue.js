// MG16_DocRescue.js - 資料を隠すな！
// 操作: クリック（タップ）で資料を救出
// 成功: 3枚全救出 / 失敗: 資料がシュレッダーに到達

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const DOC_COUNT = 3;
const DOC_SPEED = 60;
const SHREDDER_X = GAME_WIDTH - 30;

export default class MG16_DocRescue extends MiniGameBase {
  constructor() {
    super({ key: 'MG16_DocRescue' });
    this.gameTitle = '資料を隠すな！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff8e1).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 70, '資料をタップして救出せよ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    this.docs = [];
    this.rescuedCount = 0;
    this.failed = false;
    super.create();
  }

  onGameStart() {
    // シュレッダー
    this.add.text(SHREDDER_X, GAME_HEIGHT / 2, '🗑️', {
      fontSize: '50px',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(SHREDDER_X, GAME_HEIGHT / 2 + 50, 'シュレッダー', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#cc0000',
    }).setOrigin(0.5);

    // 資料を1秒おきに出現
    for (let i = 0; i < DOC_COUNT; i++) {
      this.time.delayedCall(i * 1200, () => {
        if (!this.isPlaying) return;
        this._spawnDoc(i);
      });
    }
  }

  _spawnDoc(idx) {
    const y = 250 + idx * 150;
    const docObj = this.add.text(30, y, '📄', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

    this.add.text(30, y + 30, `資料${idx + 1}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#333333',
    }).setOrigin(0.5).setDepth(10);

    const doc = { obj: docObj, rescued: false };
    this.docs.push(doc);

    docObj.on('pointerdown', () => {
      if (!this.isPlaying || doc.rescued) return;
      doc.rescued = true;
      docObj.disableInteractive();
      this.tweens.add({
        targets: docObj,
        y: y - 100,
        alpha: 0,
        duration: 300,
        onComplete: () => docObj.destroy(),
      });
      this.rescuedCount++;
      if (this.rescuedCount >= DOC_COUNT) {
        this.time.delayedCall(300, () => this.endGame(true));
      }
    });
  }

  update(time, delta) {
    if (!this.isPlaying || this.failed) return;
    const dt = delta / 1000;

    this.docs.forEach(doc => {
      if (doc.rescued || !doc.obj.active) return;
      doc.obj.x += DOC_SPEED * dt;

      if (doc.obj.x >= SHREDDER_X - 30) {
        this.failed = true;
        this.cameras.main.shake(200, 0.01);
        this.endGame(false);
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
