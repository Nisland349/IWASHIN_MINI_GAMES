// MG05_SNSSpy.js - SNS投稿を発見せよ！
// 操作: タップ/クリック
// 成功: 流れてくる不祥事投稿をタップ / 失敗: 見逃しor誤タップ3回or時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CAT_POSTS = [
  { emoji: '🐱', text: 'にゃーん♪今日もいい天気' },
  { emoji: '😺', text: 'まったり昼寝中zzz' },
  { emoji: '🐈', text: '日向ぼっこサイコー☀️' },
  { emoji: '😸', text: 'ごはんまだかにゃ？' },
  { emoji: '🐾', text: '肉球ぷにぷに' },
  { emoji: '😻', text: '新しいおもちゃ最高！' },
  { emoji: '🐱', text: 'お昼寝の時間だにゃ' },
  { emoji: '😺', text: 'カリカリ美味しい' },
  { emoji: '🐈', text: '窓の外の鳥が気になる' },
  { emoji: '🐾', text: '箱に入るの大好き' },
];

const SCANDAL_POSTS = [
  { emoji: '🔥', text: '内部告発！不正融資発覚' },
  { emoji: '🔥', text: '無断借名融資の実態！' },
  { emoji: '🔥', text: '隠蔽工作の証拠流出！' },
];

const SCROLL_SPEED = 200;
const CARD_W = 300;
const CARD_H = 70;
const SPAWN_INTERVAL = 600;
const MISS_LIMIT = 3;

export default class MG05_SNSSpy extends MiniGameBase {
  constructor() {
    super({ key: 'MG05_SNSSpy' });
    this.gameTitle = 'SNS投稿を発見せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf0f4f8).setOrigin(0);

    this.add.rectangle(0, 0, GAME_WIDTH, 60, 0x1da1f2).setOrigin(0);
    this.add.text(GAME_WIDTH / 2, 30, 'いわしんTimeline', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 80, '🔥投稿が流れてきたらタップ！', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    this.cards = [];
    this.missCount = 0;
    this.scandalSpawned = false;
    this.scandalTapped = false;
    this.spawnTimer = 0;
    this.spawnIndex = 0;

    super.create();
  }

  onGameStart() {
    this.scandalOrder = Phaser.Math.Between(2, 4);
    this._buildQueue();
  }

  _buildQueue() {
    const cats = Phaser.Utils.Array.Shuffle([...CAT_POSTS]);
    this.queue = [];
    for (let i = 0; i < 7; i++) {
      if (i === this.scandalOrder) {
        const s = Phaser.Utils.Array.GetRandom(SCANDAL_POSTS);
        this.queue.push({ ...s, isScandal: true });
      } else {
        this.queue.push({ ...cats[i % cats.length], isScandal: false });
      }
    }
  }

  _spawnCard(post) {
    const x = (GAME_WIDTH - CARD_W) / 2;
    const y = GAME_HEIGHT + 10;
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, CARD_W, CARD_H, post.isScandal ? 0xfff0e0 : 0xffffff)
      .setOrigin(0)
      .setStrokeStyle(2, post.isScandal ? 0xff6600 : 0xdddddd)
      .setInteractive();
    container.add(bg);

    const emoji = this.add.text(16, CARD_H / 2, post.emoji, { fontSize: '28px' }).setOrigin(0, 0.5);
    container.add(emoji);

    const txt = this.add.text(56, CARD_H / 2, post.text, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: post.isScandal ? '#cc3300' : '#333333',
      fontStyle: post.isScandal ? 'bold' : 'normal',
      wordWrap: { width: CARD_W - 72 },
    }).setOrigin(0, 0.5);
    container.add(txt);

    if (post.isScandal) {
      const border = this.add.rectangle(0, 0, 4, CARD_H, 0xff4444).setOrigin(0);
      container.add(border);
    }

    const card = { container, isScandal: post.isScandal, tapped: false };

    bg.on('pointerdown', () => {
      if (!this.isPlaying || card.tapped || this.scandalTapped) return;
      card.tapped = true;
      if (post.isScandal) {
        this.scandalTapped = true;
        bg.setFillStyle(0xaaffaa);
        this.add.text(container.x + CARD_W / 2, container.y + CARD_H / 2, '発見！', {
          fontFamily: 'sans-serif',
          fontSize: '24px',
          fontStyle: 'bold',
          color: '#00aa00',
          stroke: '#ffffff',
          strokeThickness: 4,
        }).setOrigin(0.5).setDepth(100);
        this.time.delayedCall(300, () => this.endGame(true));
      } else {
        bg.setFillStyle(0xffcccc);
        this.cameras.main.shake(100, 0.006);
        this.missCount++;
        if (this.missCount >= MISS_LIMIT) {
          this.time.delayedCall(200, () => this.endGame(false));
        } else {
          this.time.delayedCall(200, () => {
            if (!card.tapped) return;
            bg.setFillStyle(0xffffff);
          });
        }
      }
    });

    this.cards.push(card);
  }

  update(time, delta) {
    if (!this.isPlaying || this.scandalTapped) return;
    const dt = delta / 1000;

    this.spawnTimer += delta;
    if (this.spawnTimer >= SPAWN_INTERVAL && this.spawnIndex < this.queue.length) {
      this.spawnTimer -= SPAWN_INTERVAL;
      this._spawnCard(this.queue[this.spawnIndex]);
      this.spawnIndex++;
    }

    for (const card of this.cards) {
      if (card.tapped && !card.isScandal) continue;
      card.container.y -= SCROLL_SPEED * dt;

      if (!card.tapped && card.isScandal && card.container.y + CARD_H < 60) {
        card.tapped = true;
        this.endGame(false);
        return;
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
