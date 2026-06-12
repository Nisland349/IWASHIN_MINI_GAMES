// MG32_Postpone.js - 返済を先延ばしせよ！
// 操作: ボタン連打
// 成功: 10回クリック / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const REQUIRED_CLICKS = 10;

export default class MG32_Postpone extends MiniGameBase {
  constructor() {
    super({ key: 'MG32_Postpone' });
    this.gameTitle = '返済を先延ばしせよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x37474f).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, `ボタンを${REQUIRED_CLICKS}回連打！`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#eceff1',
    }).setOrigin(0.5);

    this.clickCount = 0;
    super.create();
  }

  onGameStart() {
    this.countText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, `0 / ${REQUIRED_CLICKS}`, {
      fontFamily: 'sans-serif',
      fontSize: '40px',
      fontStyle: 'bold',
      color: '#ffee58',
    }).setOrigin(0.5).setDepth(10);

    // プログレスバー
    this.barBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 280, 25, 0x546e7a).setDepth(5);
    this.bar = this.add.rectangle(GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 - 10, 0, 25, 0xffee58)
      .setOrigin(0, 0.5).setDepth(6);

    const btn = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 280, 90, 0x78909c)
      .setStrokeStyle(4, 0xb0bec5)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);

    const btnLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, '返済期限\n延長！', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setDepth(11);

    this.inputHandler.onClick(() => {
      if (!this.isPlaying) return;
      this.clickCount++;
      this.countText.setText(`${this.clickCount} / ${REQUIRED_CLICKS}`);
      const ratio = this.clickCount / REQUIRED_CLICKS;
      this.bar.setScale(ratio, 1);
      this.bar.width = 280 * ratio;

      // ボタン効果
      this.tweens.add({
        targets: btn,
        scaleX: 0.92,
        scaleY: 0.92,
        duration: 60,
        yoyo: true,
      });

      if (this.clickCount >= REQUIRED_CLICKS) {
        this.time.delayedCall(200, () => this.endGame(true));
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
