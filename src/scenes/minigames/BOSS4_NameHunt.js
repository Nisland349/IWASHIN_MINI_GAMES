// BOSS4_NameHunt.js - 無断借名・全件特定チャレンジ
// 操作: 怪しい名義をタップ（正常タップはミス）
// 成功: 20個特定 / 失敗: 3ミス or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const GOAL = 20;
const MAX_MISS = 3;
const SCROLL_SPEED = 60;
const SPAWN_INTERVAL = 800;

const FAKE_NAMES = ['架空商事', 'ペラペラ企業', '存在不明商店', '幽霊物産', '架空建設', '無実業社'];
const REAL_NAMES = ['田中建設', '山田物産', '鈴木食品', '中村工業', '佐藤電器', '渡辺商店', '伊藤製作'];

export default class BOSS4_NameHunt extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS4_NameHunt' });
    this.gameTitle = '借名・全件特定！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 55, `怪しい名義をタップ！ 目標: ${GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#90caf9',
    }).setOrigin(0.5);

    this.found = 0;
    this.miss = 0;
    this.cards = [];
    super.create();
  }

  onGameStart() {
    this.foundText = this.add.text(30, 90, `発見: 0/${GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#69f0ae',
    }).setDepth(20);

    this.missText = this.add.text(GAME_WIDTH - 30, 90, `ミス: 0/${MAX_MISS}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ef5350',
    }).setOrigin(1, 0).setDepth(20);

    this.time.addEvent({
      delay: SPAWN_INTERVAL,
      repeat: -1,
      callback: () => {
        if (!this.isPlaying) return;
        this._spawnCard();
      },
    });
    this._spawnCard();
    this._spawnCard();
  }

  _spawnCard() {
    const isFake = Math.random() < 0.45;
    const nameList = isFake ? FAKE_NAMES : REAL_NAMES;
    const name = nameList[Math.floor(Math.random() * nameList.length)];
    const x = 30 + Math.random() * (GAME_WIDTH - 100);

    const bg = this.add.rectangle(x, GAME_HEIGHT + 40, 140, 55, isFake ? 0x3e1212 : 0x1a2a3a)
      .setStrokeStyle(2, isFake ? 0xe53935 : 0x455a64)
      .setInteractive({ useHandCursor: true })
      .setDepth(5);

    const label = this.add.text(x, GAME_HEIGHT + 40, name, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: isFake ? '#ff5252' : '#90a4ae',
    }).setOrigin(0.5).setDepth(6);

    const card = { bg, label, isFake, vy: -SCROLL_SPEED, done: false };
    this.cards.push(card);

    bg.on('pointerdown', () => {
      if (!this.isPlaying || card.done) return;
      card.done = true;
      bg.disableInteractive();

      if (isFake) {
        bg.setFillStyle(0x1b5e20);
        this.found++;
        this.foundText.setText(`発見: ${this.found}/${GOAL}`);
        if (this.found >= GOAL) this.endGame(true);
      } else {
        bg.setFillStyle(0x7f0000);
        this.cameras.main.shake(150, 0.01);
        this.miss++;
        this.missText.setText(`ミス: ${this.miss}/${MAX_MISS}`);
        if (this.miss >= MAX_MISS) this.endGame(false);
      }
    });
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;

    for (let i = this.cards.length - 1; i >= 0; i--) {
      const c = this.cards[i];
      c.bg.y += c.vy * dt;
      c.label.y = c.bg.y;

      if (c.bg.y < -60) {
        c.bg.destroy();
        c.label.destroy();
        this.cards.splice(i, 1);
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
