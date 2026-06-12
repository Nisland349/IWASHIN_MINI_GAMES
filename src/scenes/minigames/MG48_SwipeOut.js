// MG48_SwipeOut.js - 組織改革を進めろ！
// 操作: カードを左右スワイプで退任
// 成功: 3枚全退任 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CARDS_DATA = ['旧理事長\n在任20年', '旧常務理事\n在任15年', '旧監事\n在任12年'];

export default class MG48_SwipeOut extends MiniGameBase {
  constructor() {
    super({ key: 'MG48_SwipeOut' });
    this.gameTitle = '組織改革を進めろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x37474f).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 72, '古い役職者を左右にスワイプ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#eceff1',
    }).setOrigin(0.5);

    this.retired = 0;
    this.cards = [];
    super.create();
  }

  onGameStart() {
    this.add.text(20, GAME_HEIGHT / 2 - 120, '← 退任', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#78909c',
    });
    this.add.text(GAME_WIDTH - 20, GAME_HEIGHT / 2 - 120, '退任 →', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#78909c',
    }).setOrigin(1, 0);

    CARDS_DATA.forEach((text, i) => {
      const y = 200 + i * 180;
      const bg = this.add.rectangle(GAME_WIDTH / 2, y, 280, 130, 0x546e7a)
        .setStrokeStyle(3, 0x607d8b)
        .setDepth(5);
      const label = this.add.text(GAME_WIDTH / 2, y, `👔\n${text}`, {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#eceff1',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);

      this.cards.push({ bg, label, retired: false, origY: y });
    });

    // スワイプハンドラ
    const handleSwipe = (pointer) => {
      if (!this.isPlaying) return;
      const dx = pointer.x - this.inputHandler.swipeStartX;
      const dy = pointer.y - this.inputHandler.swipeStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) return;

      // スワイプしたカードを特定
      const swipeY = this.inputHandler.swipeStartY;
      const card = this.cards.find(c =>
        !c.retired && Math.abs(c.origY - swipeY) < 65
      );
      if (!card) return;

      card.retired = true;
      const dir = dx > 0 ? GAME_WIDTH + 200 : -200;
      this.tweens.add({
        targets: [card.bg, card.label],
        x: dir,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
      });
      this.retired++;
      if (this.retired >= CARDS_DATA.length) {
        this.time.delayedCall(300, () => this.endGame(true));
      }
    };

    this.scene.scene.systems.input.on('pointerup', handleSwipe);
  }

  onTimeUp() {
    this.endGame(false);
  }
}
