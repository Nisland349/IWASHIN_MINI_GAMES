// BOSS2_MorningPanic.js - 朝会パニック・マネジメント
// 操作: スワイプで左（適切）/ 右（問題）に振り分け
// 成功: 60秒間ガバナンス崩壊ゲージをMAXにしない
// 失敗: ゲージが5段階でMAXに達する

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const MAX_CHAOS = 5;
const ITEM_DURATION = 3500;

const ITEMS_GOOD = [
  { text: '報告書提出',   type: 'good' },
  { text: '監査実施',     type: 'good' },
  { text: '理事会開催',   type: 'good' },
  { text: '内部通報受付', type: 'good' },
  { text: '規程改正',     type: 'good' },
  { text: '開示強化',     type: 'good' },
  { text: '研修実施',     type: 'good' },
];

const ITEMS_BAD = [
  { text: '資料隠蔽',   type: 'bad' },
  { text: '独断専行',   type: 'bad' },
  { text: '口裏合わせ', type: 'bad' },
  { text: '記録改ざん', type: 'bad' },
  { text: '非公開会議', type: 'bad' },
  { text: '責任転嫁',   type: 'bad' },
  { text: '虚偽報告',   type: 'bad' },
];

const ALL_ITEMS = [...ITEMS_GOOD, ...ITEMS_BAD];

export default class BOSS2_MorningPanic extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS2_MorningPanic' });
    this.gameTitle = '朝会パニック！';
    this.gameDuration = 60;
  }

  create() {
    this.chaos = 0;
    this.currentItem = null;
    this.itemIndex = 0;

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '← 適切  |  問題 →', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this._drawBins();
    this._drawChaosBar();

    super.create();
  }

  onGameStart() {
    // アイテムプールをシャッフル
    this.pool = Phaser.Utils.Array.Shuffle([...ALL_ITEMS, ...ALL_ITEMS, ...ALL_ITEMS]);
    this._setupSwipeHandler();
    this._nextItem();
  }

  _drawBins() {
    const g = this.add.graphics();
    const binY = GAME_HEIGHT - 130;
    const binH = 110;

    // 適切（左）
    g.fillStyle(0x1565c0, 0.5);
    g.fillRoundedRect(10, binY, 155, binH, 10);
    g.lineStyle(3, 0x42a5f5);
    g.strokeRoundedRect(10, binY, 155, binH, 10);

    this.add.text(87, binY + 55, '✅ 適切', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    // 問題（右）
    g.fillStyle(0xb71c1c, 0.5);
    g.fillRoundedRect(GAME_WIDTH - 165, binY, 155, binH, 10);
    g.lineStyle(3, 0xef5350);
    g.strokeRoundedRect(GAME_WIDTH - 165, binY, 155, binH, 10);

    this.add.text(GAME_WIDTH - 87, binY + 55, '⚠️ 問題', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);
  }

  _drawChaosBar() {
    const barY = GAME_HEIGHT - 210;
    this.add.text(GAME_WIDTH / 2, barY - 20, '崩壊ゲージ', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.chaosSlots = [];
    const slotW = 50, slotH = 22, gap = 8;
    const totalW = MAX_CHAOS * slotW + (MAX_CHAOS - 1) * gap;
    const startX = GAME_WIDTH / 2 - totalW / 2;

    for (let i = 0; i < MAX_CHAOS; i++) {
      const sx = startX + i * (slotW + gap);
      this.add.rectangle(sx, barY, slotW, slotH, 0x333333).setOrigin(0);
      const fill = this.add.rectangle(sx, barY, slotW, slotH, 0xff3344).setOrigin(0).setVisible(false);
      this.chaosSlots.push(fill);
    }
  }

  _updateChaosBar() {
    this.chaosSlots.forEach((slot, i) => slot.setVisible(i < this.chaos));
  }

  _nextItem() {
    if (!this.isPlaying) return;
    if (this.currentItem) {
      this.currentItem.container.destroy();
      this.currentItem = null;
    }

    const data = this.pool[this.itemIndex % this.pool.length];
    this.itemIndex++;
    this.currentItem = this._createItemCard(data);

    // 制限時間内にスワイプしないと崩壊
    this.currentItem.timer = this.time.delayedCall(ITEM_DURATION, () => {
      if (!this.isPlaying || !this.currentItem) return;
      this._wrongAnswer();
    });
  }

  _createItemCard(data) {
    const W = 230, H = 110;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 - 20;

    const bg = this.add.rectangle(0, 0, W, H, data.type === 'good' ? 0x1565c0 : 0xb71c1c)
      .setStrokeStyle(4, 0xffffff);
    const label = this.add.text(0, -12, data.text, {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);
    const typeLabel = this.add.text(0, 24, data.type === 'good' ? '← スワイプ →？' : '← スワイプ →？', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: 'rgba(255,255,255,0.7)',
    }).setOrigin(0.5);

    // カウントダウンリング
    const ring = this.add.graphics();

    const container = this.add.container(cx, cy, [bg, label, typeLabel, ring]);

    // リングのカウントダウン更新
    const startTime = this.time.now;
    const updateRing = this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (!this.isPlaying) return;
        const elapsed = this.time.now - startTime;
        const ratio = Math.max(0, 1 - elapsed / ITEM_DURATION);
        ring.clear();
        ring.lineStyle(5, ratio > 0.3 ? 0xffffff : 0xff4444, 0.8);
        ring.beginPath();
        ring.arc(0, 0, 62, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
        ring.strokePath();
      },
    });

    return { container, data, timer: null, ringEvent: updateRing };
  }

  _setupSwipeHandler() {
    this.inputHandler.onSwipe('left', () => {
      if (!this.isPlaying || !this.currentItem) return;
      const expected = 'good'; // ← 左 = 適切
      this._judge(expected);
    });
    this.inputHandler.onSwipe('right', () => {
      if (!this.isPlaying || !this.currentItem) return;
      const expected = 'bad'; // → 右 = 問題
      this._judge(expected);
    });
  }

  _judge(swiped) {
    const item = this.currentItem;
    if (!item) return;
    if (item.timer) item.timer.remove();
    if (item.ringEvent) item.ringEvent.remove();

    if (item.data.type === swiped) {
      // 正解
      this.tweens.add({
        targets: item.container,
        x: swiped === 'good' ? 87 : GAME_WIDTH - 87,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          item.container.destroy();
          this.currentItem = null;
          this.time.delayedCall(200, () => this._nextItem());
        },
      });
    } else {
      this._wrongAnswer();
    }
  }

  _wrongAnswer() {
    const item = this.currentItem;
    if (item) {
      if (item.ringEvent) item.ringEvent.remove();
      this.tweens.add({
        targets: item.container,
        y: item.container.y + 60,
        alpha: 0,
        duration: 300,
        onComplete: () => item.container.destroy(),
      });
      this.currentItem = null;
    }

    this.chaos++;
    this._updateChaosBar();
    this.cameras.main.shake(150, 0.012);

    if (this.chaos >= MAX_CHAOS) {
      this.time.delayedCall(200, () => this.endGame(false));
      return;
    }

    this.time.delayedCall(400, () => this._nextItem());
  }

  onTimeUp() {
    this.endGame(true);
  }
}
