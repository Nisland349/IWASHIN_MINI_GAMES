// MG13_SecretDoor.js - 非公式ミーティングを探せ！
// 操作: クリック/タップ
// 成功: 怪しいドアを発見 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const DOOR_CONTENTS = [
  { label: '空き部屋',     emoji: '🏠', suspicious: false },
  { label: '倉庫',         emoji: '📦', suspicious: false },
  { label: '秘密会議！',   emoji: '🤫', suspicious: true  },
  { label: 'お手洗い',     emoji: '🚽', suspicious: false },
];

export default class MG13_SecretDoor extends MiniGameBase {
  constructor() {
    super({ key: 'MG13_SecretDoor' });
    this.gameTitle = '非公式ミーティングを探せ！';
    this.gameDuration = 5;
  }

  create() {
    // 廊下の壁
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xd7ccc8).setOrigin(0);
    this.add.rectangle(0, 0, GAME_WIDTH, 80, 0x5d4037).setOrigin(0);
    this.add.rectangle(0, GAME_HEIGHT - 80, GAME_WIDTH, 80, 0x5d4037).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 40, '🔍 どこで秘密会議が？', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...DOOR_CONTENTS]);
    const cols = 2;
    const DOOR_W = 130;
    const DOOR_H = 200;
    const gapX = (GAME_WIDTH - DOOR_W * cols) / (cols + 1);
    const rows = [GAME_HEIGHT * 0.35, GAME_HEIGHT * 0.67];

    shuffled.forEach((content, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = gapX + col * (DOOR_W + gapX) + DOOR_W / 2;
      const y = rows[row];
      this._createDoor(x, y, DOOR_W, DOOR_H, content);
    });
  }

  _createDoor(cx, cy, w, h, content) {
    // ドア枠
    const g = this.add.graphics();
    g.fillStyle(0x6d4c41);
    g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 6);
    g.lineStyle(4, 0x4e342e);
    g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 6);

    // ドアノブ
    g.fillStyle(0xffd54f);
    g.fillCircle(cx + w / 2 - 18, cy + 10, 8);

    // ドア番号プレート
    const doorText = this.add.text(cx, cy - h / 2 + 22, '🚪', {
      fontSize: '32px',
    }).setOrigin(0.5);

    // クリック判定用透明オーバーレイ
    const hitArea = this.add.rectangle(cx, cy, w, h, 0xffffff, 0)
      .setInteractive()
      .setDepth(5);

    let opened = false;
    hitArea.on('pointerdown', () => {
      if (!this.isPlaying || opened) return;
      opened = true;
      this._openDoor(cx, cy, w, h, content, g, doorText);
    });
  }

  _openDoor(cx, cy, w, h, content, g, doorText) {
    // ドアが開くアニメ（横に縮む）
    this.tweens.add({
      targets: g,
      scaleX: 0,
      duration: 250,
      ease: 'Power2',
      onComplete: () => {
        doorText.setVisible(false);
        // 中身を表示
        const contentBg = this.add.rectangle(cx, cy, w, h, content.suspicious ? 0xff6b6b : 0xf5f5f5)
          .setDepth(3);
        this.add.text(cx, cy - 30, content.emoji, { fontSize: '42px' }).setOrigin(0.5).setDepth(4);
        this.add.text(cx, cy + 25, content.label, {
          fontFamily: 'sans-serif',
          fontSize: '14px',
          fontStyle: 'bold',
          color: content.suspicious ? '#ffffff' : '#333333',
          align: 'center',
        }).setOrigin(0.5).setDepth(4);

        if (content.suspicious) {
          this.time.delayedCall(300, () => this.endGame(true));
        }
      },
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
