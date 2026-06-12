// MG55_Roadmap.js - ロードマップを完成させろ！
// 操作: カードを正しい順番の位置へドラッグ
// 成功: 4枚全て正しく配置 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const PHASES = ['短期', '中期', '長期', '継続'];

export default class MG55_Roadmap extends MiniGameBase {
  constructor() {
    super({ key: 'MG55_Roadmap' });
    this.gameTitle = 'ロードマップを\n完成させろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf3e5f5).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '左から順番に並べろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#4a148c',
    }).setOrigin(0.5);

    this.placed = 0;
    this.cardObjs = [];
    super.create();
  }

  onGameStart() {
    const slotW = (GAME_WIDTH - 20) / PHASES.length;
    const slotY = GAME_HEIGHT / 2 - 80;

    // スロット（正解位置）
    this.slots = PHASES.map((phase, i) => {
      const x = 10 + i * slotW + slotW / 2;
      const g = this.add.rectangle(x, slotY, slotW - 10, 90, 0xffffff, 0.3)
        .setStrokeStyle(2, 0xce93d8);
      this.add.text(x, slotY + 55, `${i + 1}`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#ce93d8',
      }).setOrigin(0.5).setDepth(3);
      return { phase, x, y: slotY, filled: false };
    });

    // カード（シャッフル）
    const shuffled = Phaser.Utils.Array.Shuffle([...PHASES]);
    shuffled.forEach((phase, i) => {
      const x = 50 + i * 80;
      const y = GAME_HEIGHT / 2 + 120;
      const W = 72, H = 80;
      const correctSlotIdx = PHASES.indexOf(phase);

      const bg = this.add.rectangle(x, y, W, H, 0x9c27b0)
        .setStrokeStyle(3, 0xce93d8)
        .setInteractive()
        .setDepth(10);

      const label = this.add.text(x, y, phase, {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.cardObjs.push({ bg, label, phase, correctSlotIdx, placed: false, startX: x, startY: y });
    });

    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.cardObjs.find(c => c.bg === go);
      if (obj) obj.label.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.cardObjs.find(c => c.bg === go);
      if (!obj || obj.placed) return;

      // 最近いスロットを探す
      let nearest = null;
      let minDist = 60;
      this.slots.forEach(slot => {
        if (slot.filled) return;
        const dx = go.x - slot.x;
        const dy = go.y - slot.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) {
          minDist = d;
          nearest = slot;
        }
      });

      if (nearest && PHASES.indexOf(obj.phase) === this.slots.indexOf(nearest)) {
        // 正しい位置
        obj.placed = true;
        nearest.filled = true;
        this.tweens.add({
          targets: [go, obj.label],
          x: nearest.x,
          y: nearest.y,
          duration: 150,
        });
        obj.bg.setFillStyle(0x7b1fa2);
        this.placed++;
        if (this.placed >= PHASES.length) {
          this.time.delayedCall(300, () => this.endGame(true));
        }
      } else {
        // 間違いまたは位置が遠い → 元に戻す
        this.tweens.add({
          targets: [go, obj.label],
          x: obj.startX,
          y: obj.startY,
          duration: 200,
          ease: 'Back.easeOut',
        });
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
