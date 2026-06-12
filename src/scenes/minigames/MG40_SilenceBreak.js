// MG40_SilenceBreak.js - 沈黙を破れ！
// 操作: クリック連打でHP削る
// 成功: HP=0 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const WALL_HP = 15;

export default class MG40_SilenceBreak extends MiniGameBase {
  constructor() {
    super({ key: 'MG40_SilenceBreak' });
    this.gameTitle = '沈黙を破れ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x212121).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '壁をタップで破壊！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#eeeeee',
    }).setOrigin(0.5);

    this.hp = WALL_HP;
    super.create();
  }

  onGameStart() {
    // 壁
    this.wall = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 200, 0x616161)
      .setStrokeStyle(4, 0x9e9e9e)
      .setInteractive({ useHandCursor: true })
      .setDepth(5);

    this.wallLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '沈黙の壁', {
      fontFamily: 'sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#eeeeee',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(6);

    // HPバー背景
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 130, 280, 22, 0x424242).setDepth(7);
    this.hpBar = this.add.rectangle(GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 - 130, 280, 22, 0xef5350)
      .setOrigin(0, 0.5).setDepth(8);
    this.hpText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 130, `HP: ${this.hp}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(9);

    this.inputHandler.onClick(() => {
      if (!this.isPlaying || this.hp <= 0) return;
      this.hp--;
      const ratio = this.hp / WALL_HP;
      this.hpBar.setScale(ratio, 1);
      this.hpText.setText(`HP: ${this.hp}`);

      // クラック演出
      const crack = this.add.text(
        GAME_WIDTH / 2 + (Math.random() - 0.5) * 200,
        GAME_HEIGHT / 2 + (Math.random() - 0.5) * 150,
        '💥', { fontSize: '24px' }
      ).setOrigin(0.5).setDepth(10);
      this.time.delayedCall(300, () => crack.destroy());
      this.cameras.main.shake(80, 0.008);

      const grayVal = Math.floor(0x61 + (0x61 * ratio));
      this.wall.setFillStyle(Phaser.Display.Color.GetColor(grayVal, grayVal, grayVal));

      if (this.hp <= 0) {
        this.wall.disableInteractive();
        this.wallLabel.setText('！！！');
        this.time.delayedCall(300, () => this.endGame(true));
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
