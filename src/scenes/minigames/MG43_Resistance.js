// MG43_Resistance.js - 背任を回避せよ！
// 操作: クリック連打で手のHPを削る
// 成功: 手のHP=0 / 失敗: ボタンが押される

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const HAND_HP = 10;
const HAND_SPEED = 60; // px/sec、ボタンに向かって進む速度

export default class MG43_Resistance extends MiniGameBase {
  constructor() {
    super({ key: 'MG43_Resistance' });
    this.gameTitle = '背任を回避せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a237e).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '手を連打して押し返せ！', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      color: '#e8eaf6',
    }).setOrigin(0.5);

    this.handHp = HAND_HP;
    this.ended = false;
    super.create();
  }

  onGameStart() {
    const btnX = GAME_WIDTH / 2;
    const btnY = GAME_HEIGHT / 2 + 80;

    // 危険ボタン
    this.add.rectangle(btnX, btnY, 200, 90, 0xd32f2f)
      .setStrokeStyle(4, 0xb71c1c).setDepth(5);
    this.add.text(btnX, btnY, '不正承認', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(6);

    this.btnX = btnX;
    this.btnY = btnY;

    // 手
    this.hand = this.add.text(GAME_WIDTH - 30, GAME_HEIGHT / 2 + 80, '🖐️', {
      fontSize: '52px',
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

    // HPバー
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 240, 20, 0x37474f).setDepth(7);
    this.hpBar = this.add.rectangle(GAME_WIDTH / 2 - 120, GAME_HEIGHT / 2 - 60, 240, 20, 0xff5722)
      .setOrigin(0, 0.5).setDepth(8);

    this.inputHandler.onClick(() => {
      if (!this.isPlaying || this.handHp <= 0) return;
      this.handHp--;
      const ratio = this.handHp / HAND_HP;
      this.hpBar.setScale(ratio, 1);
      this.cameras.main.shake(60, 0.006);
      this.hand.setX(Math.min(GAME_WIDTH - 30, this.hand.x + 15));

      if (this.handHp <= 0) {
        this.ended = true;
        this.hand.setText('💨');
        this.time.delayedCall(300, () => this.endGame(true));
      }
    });
  }

  update(time, delta) {
    if (!this.isPlaying || this.ended || this.handHp <= 0) return;
    const dt = delta / 1000;
    this.hand.x -= HAND_SPEED * dt;

    if (this.hand.x <= this.btnX + 100) {
      this.ended = true;
      this.cameras.main.shake(300, 0.015);
      this.time.delayedCall(400, () => this.endGame(false));
    }
  }

  onTimeUp() {
    if (!this.ended) this.endGame(false);
  }
}
