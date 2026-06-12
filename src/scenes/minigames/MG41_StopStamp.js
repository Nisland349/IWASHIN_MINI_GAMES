// MG41_StopStamp.js - 文書偽造を止めろ！
// 操作: クリックして印鑑を止める
// 成功: 書類に押される前にクリック / 失敗: 印鑑が書類に到達

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const STAMP_SPEED = (GAME_WIDTH - 80) / 4; // 4秒で横断

export default class MG41_StopStamp extends MiniGameBase {
  constructor() {
    super({ key: 'MG41_StopStamp' });
    this.gameTitle = '文書偽造を止めろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff9c4).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '印鑑をタップして止めろ！', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#b71c1c',
    }).setOrigin(0.5);

    this.stamped = false;
    super.create();
  }

  onGameStart() {
    // 書類スペース（右端）
    const docX = GAME_WIDTH - 40;
    const docY = GAME_HEIGHT / 2;
    this.add.rectangle(docX, docY, 70, 120, 0xffffff)
      .setStrokeStyle(3, 0xd32f2f);
    this.add.text(docX, docY, '📄\n書類', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#b71c1c',
      align: 'center',
    }).setOrigin(0.5);

    this.docX = docX;

    // 印鑑（左から右へ移動）
    this.stamp = this.add.text(30, GAME_HEIGHT / 2, '🔏', {
      fontSize: '48px',
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

    this.stamp.on('pointerdown', () => {
      if (!this.isPlaying || this.stamped) return;
      this.stamped = true;
      this.stamp.disableInteractive();
      this.tweens.add({
        targets: this.stamp,
        y: GAME_HEIGHT / 2 - 100,
        alpha: 0,
        duration: 300,
      });
      this.time.delayedCall(300, () => this.endGame(true));
    });
  }

  update(time, delta) {
    if (!this.isPlaying || this.stamped) return;
    const dt = delta / 1000;

    this.stamp.x += STAMP_SPEED * dt;

    if (this.stamp.x >= this.docX - 30) {
      this.stamped = true;
      this.cameras.main.shake(300, 0.015);
      this.stamp.setText('❌').setFontSize('48px');
      this.time.delayedCall(400, () => this.endGame(false));
    }
  }

  onTimeUp() {
    if (!this.stamped) {
      this.endGame(false);
    }
  }
}
