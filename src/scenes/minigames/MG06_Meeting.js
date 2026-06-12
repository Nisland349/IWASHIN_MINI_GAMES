// MG06_Meeting.js - ミーティングを開催せよ！
// 操作: ドラッグ
// 成功: 3人の委員を会議室中央に集める / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const MEMBERS = [
  { name: '弁護士', emoji: '⚖️', color: 0x3355ff },
  { name: '会計士', emoji: '📊', color: 0x229977 },
  { name: '教授',   emoji: '🎓', color: 0x7733bb },
];
const TARGET_X = GAME_WIDTH / 2;
const TARGET_Y = GAME_HEIGHT / 2 + 30;
const TARGET_R = 80;
const MEMBER_R = 36;

const START_POS = [
  { x: 70,              y: GAME_HEIGHT * 0.28 },
  { x: GAME_WIDTH - 70, y: GAME_HEIGHT * 0.32 },
  { x: GAME_WIDTH / 2,  y: GAME_HEIGHT * 0.78 },
];

export default class MG06_Meeting extends MiniGameBase {
  constructor() {
    super({ key: 'MG06_Meeting' });
    this.gameTitle = 'ミーティングを\n開催せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a2a1a).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '委員を会議室に集めろ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.lockedCount = 0;
    this.memberObjs = [];
    super.create();
  }

  onGameStart() {
    this._drawRoom();
    this._spawnMembers();
    this._setupDrag();
  }

  _drawRoom() {
    const g = this.add.graphics();
    g.fillStyle(0x225522, 0.4);
    g.fillCircle(TARGET_X, TARGET_Y, TARGET_R);
    g.lineStyle(3, 0x88ff88, 0.7);
    g.strokeCircle(TARGET_X, TARGET_Y, TARGET_R);

    this.add.text(TARGET_X, TARGET_Y, '会議室', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#aaffaa',
    }).setOrigin(0.5);
  }

  _spawnMembers() {
    MEMBERS.forEach((member, i) => {
      const { x, y } = START_POS[i];
      const circle = this.add.circle(x, y, MEMBER_R, member.color)
        .setStrokeStyle(3, 0xffffff)
        .setInteractive()
        .setDepth(10);

      const label = this.add.text(x, y, member.emoji, {
        fontSize: '24px',
      }).setOrigin(0.5).setDepth(11);

      const nameText = this.add.text(x, y + MEMBER_R + 12, member.name, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(circle);
      this.memberObjs.push({ circle, label, nameText, locked: false });
    });
  }

  _setupDrag() {
    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const obj = this.memberObjs.find(m => m.circle === go);
      if (obj) {
        obj.label.setPosition(x, y);
        obj.nameText.setPosition(x, y + MEMBER_R + 12);
      }
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const obj = this.memberObjs.find(m => m.circle === go);
      if (!obj || obj.locked) return;
      const dx = go.x - TARGET_X;
      const dy = go.y - TARGET_Y;
      if (Math.sqrt(dx * dx + dy * dy) < TARGET_R) {
        this._lockMember(obj);
      }
    });
  }

  _lockMember(obj) {
    obj.locked = true;
    this.lockedCount++;

    const angle = (this.lockedCount - 1) * (Math.PI * 2 / 3) - Math.PI / 2;
    const nx = TARGET_X + Math.cos(angle) * 42;
    const ny = TARGET_Y + Math.sin(angle) * 42;

    this.tweens.add({
      targets: obj.circle,
      x: nx,
      y: ny,
      duration: 200,
      ease: 'Back.easeOut',
      onUpdate: () => obj.label.setPosition(obj.circle.x, obj.circle.y),
      onComplete: () => obj.nameText.setVisible(false),
    });

    obj.circle.setFillStyle(0x44ee44).setStrokeStyle(3, 0x00bb00);

    if (this.lockedCount >= 3) {
      this.time.delayedCall(400, () => this.endGame(true));
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
