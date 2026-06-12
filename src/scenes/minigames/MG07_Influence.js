// MG07_Influence.js - 影響力を排除せよ！
// 操作: クリック/タップ
// 成功: "影響力"バブルを全て排除 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const BUBBLE_COUNT = 7;
const BUBBLE_R = 42;

export default class MG07_Influence extends MiniGameBase {
  constructor() {
    super({ key: 'MG07_Influence' });
    this.gameTitle = '影響力を排除せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a0a2e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '影響力を全て弾き飛ばせ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ff88ff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.bubbles = [];
    this.remaining = BUBBLE_COUNT;
    super.create();
  }

  onGameStart() {
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      this._spawnBubble();
    }

    this.inputHandler.onClick((pointer) => {
      if (!this.isPlaying) return;
      for (const b of this.bubbles) {
        if (b.popped) continue;
        const dx = pointer.x - b.x;
        const dy = pointer.y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < BUBBLE_R) {
          this._popBubble(b);
          break;
        }
      }
    });
  }

  _spawnBubble() {
    const margin = BUBBLE_R + 20;
    const x = Phaser.Math.Between(margin, GAME_WIDTH - margin);
    const y = Phaser.Math.Between(130, GAME_HEIGHT - margin);
    let vx = (Math.random() - 0.5) * 180;
    let vy = (Math.random() - 0.5) * 180;
    // 最低速度を保証
    if (Math.abs(vx) < 40) vx = vx < 0 ? -40 : 40;
    if (Math.abs(vy) < 40) vy = vy < 0 ? -40 : 40;

    const g = this.add.graphics();
    g.fillStyle(0x8800cc, 0.85);
    g.fillCircle(0, 0, BUBBLE_R);
    g.lineStyle(3, 0xff44ff);
    g.strokeCircle(0, 0, BUBBLE_R);

    const text = this.add.text(0, 0, '影響力', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [g, text]);
    this.bubbles.push({ container, x, y, vx, vy, popped: false });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    for (const b of this.bubbles) {
      if (b.popped) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < BUBBLE_R || b.x > GAME_WIDTH - BUBBLE_R) b.vx *= -1;
      if (b.y < 120 || b.y > GAME_HEIGHT - BUBBLE_R) b.vy *= -1;
      b.container.setPosition(b.x, b.y);
    }
  }

  _popBubble(b) {
    b.popped = true;
    this.tweens.add({
      targets: b.container,
      scale: 2,
      alpha: 0,
      duration: 250,
      ease: 'Power2',
      onComplete: () => b.container.destroy(),
    });

    this.remaining--;
    if (this.remaining <= 0) {
      this.time.delayedCall(300, () => this.endGame(true));
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
