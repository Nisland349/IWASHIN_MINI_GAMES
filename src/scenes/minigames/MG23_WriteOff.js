// MG23_WriteOff.js - 償却を止めろ！
// 操作: タップ連打で残高回復
// 成功: 残高 > 0 で5秒生存 / 失敗: 残高が0になる

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const INITIAL_BALANCE = 5000;
const DRAIN_PER_SEC = 1200;
const RECOVER_PER_TAP = 200;

export default class MG23_WriteOff extends MiniGameBase {
  constructor() {
    super({ key: 'MG23_WriteOff' });
    this.gameTitle = '償却を止めろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xb71c1c).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '残高が0になる前にタップ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffcdd2',
    }).setOrigin(0.5);

    this.currentBalance = INITIAL_BALANCE;
    super.create();
  }

  onGameStart() {
    // 残高表示
    this.balanceText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, `¥${this.currentBalance}万`, {
      fontFamily: 'sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(10);

    // プログレスバー背景
    this.barBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 300, 30, 0x7f0000)
      .setDepth(5);
    this.bar = this.add.rectangle(
      GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 + 40, 300, 30, 0xf44336
    ).setOrigin(0, 0.5).setDepth(6);

    // タップボタン
    const btn = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150, 260, 80, 0xffeb3b)
      .setStrokeStyle(4, 0xf9a825)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150, '💰 タップ！', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#b71c1c',
    }).setOrigin(0.5).setDepth(11);

    this.inputHandler.onClick(() => {
      if (!this.isPlaying) return;
      this.currentBalance = Math.min(INITIAL_BALANCE, this.currentBalance + RECOVER_PER_TAP);
      this._updateUI();
    });
  }

  _updateUI() {
    this.balanceText.setText(`¥${Math.floor(this.currentBalance)}万`);
    const ratio = Math.max(0, this.currentBalance / INITIAL_BALANCE);
    this.bar.setScale(ratio, 1);

    if (ratio < 0.3) {
      this.balanceText.setColor('#ff5252');
    } else {
      this.balanceText.setColor('#ffffff');
    }
  }

  update(time, delta) {
    if (!this.isPlaying) return;
    const dt = delta / 1000;
    this.currentBalance -= DRAIN_PER_SEC * dt;
    this._updateUI();

    if (this.currentBalance <= 0) {
      this.currentBalance = 0;
      this._updateUI();
      this.endGame(false);
    }
  }

  onTimeUp() {
    if (this.currentBalance > 0) {
      this.endGame(true);
    } else {
      this.endGame(false);
    }
  }
}
