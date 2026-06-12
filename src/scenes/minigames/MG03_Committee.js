// MG03_Committee.js - 委員会メンバーを揃えろ！
// 参照: mock/mg03_committee.html
// 操作: クリック選択
// 成功: 正しいメンバー(isValid)を2人以上選択
// 失敗: 利害関係者を1人でも選ぶ or 時間切れ(2人未満)

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const CHAR_RADIUS = 44;
const NEEDED = 2;

const CANDIDATES = [
  { name: '弁護士',     image: 'job_bengoshi_man',              color: 0x3f51b5, isValid: true  },
  { name: '会計士',     image: 'job_kaikeishi_man',             color: 0x009688, isValid: true  },
  { name: '教授',       image: 'job_sensei',                    color: 0x673ab7, isValid: true  },
  { name: '利害関係者', image: 'niyakeru_takuramu_ayashii_man', color: 0xf44336, isValid: false },
  { name: '元役員',     image: 'pawahara_man',                  color: 0xe91e63, isValid: false },
  { name: '取引先',     image: 'sagishi_man',                   color: 0xff5722, isValid: false },
];

export default class MG03_Committee extends MiniGameBase {
  constructor() {
    super({ key: 'MG03_Committee' });
    this.gameTitle = '委員会メンバーを揃えろ！';
    this.gameDuration = 5;
  }

  preload() {
    for (const c of CANDIDATES) {
      this.load.image(c.image, `illustration/${c.image}.png`);
    }
  }

  create() {
    this.selectedValidCount = 0;
    this.characters = [];

    this._drawBackground();

    this.add.text(GAME_WIDTH / 2, 90, '独立性のある専門家を\n2人以上選べ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5);

    this._createSlots();

    super.create();
  }

  onGameStart() {
    this._spawnCharacters();
    this._setupClickHandler();
  }

  _drawBackground() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x2a1a3e).setOrigin(0);

    const dots = this.add.graphics();
    dots.fillStyle(0xff6b9d, 0.15);
    for (let x = 0; x < GAME_WIDTH; x += 40) {
      for (let y = 0; y < GAME_HEIGHT; y += 40) {
        dots.fillCircle(x, y, 4);
      }
    }
  }

  _createSlots() {
    this.slots = [];
    const slotY = GAME_HEIGHT - 60;
    const spacing = 80;
    const startX = GAME_WIDTH / 2 - (spacing * (NEEDED - 1)) / 2;

    for (let i = 0; i < NEEDED; i++) {
      const x = startX + i * spacing;
      const g = this.add.graphics();
      g.lineStyle(4, 0x000000);
      g.fillStyle(0xffffff);
      g.fillCircle(x, slotY, 28);
      g.strokeCircle(x, slotY, 28);

      const text = this.add.text(x, slotY, '?', {
        fontSize: '22px',
        color: '#bbbbbb',
      }).setOrigin(0.5);

      this.slots.push({ g, text, x, y: slotY });
    }
  }

  _spawnCharacters() {
    const shuffled = Phaser.Utils.Array.Shuffle([...CANDIDATES]);
    const cols = 3;
    const colW = GAME_WIDTH / cols;
    const rowY = [310, 560];

    shuffled.forEach((candidate, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = colW * col + colW / 2 + (Math.random() - 0.5) * 16;
      const y = rowY[row] + (Math.random() - 0.5) * 16;

      const container = this._createCharacterContainer(candidate, x, y);
      this.characters.push({ container, candidate, selected: false });

      this.tweens.add({
        targets: container,
        y: y - 10,
        duration: 600 + Math.random() * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 500,
      });
    });
  }

  _createCharacterContainer(candidate, x, y) {
    const R = CHAR_RADIUS;
    const g = this.add.graphics();

    // 影
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(0, R + 6, R * 1.6, 10);

    // 円背景
    g.fillStyle(candidate.color);
    g.fillCircle(0, 0, R);
    g.lineStyle(5, 0x000000);
    g.strokeCircle(0, 0, R);

    // ハイライト
    g.fillStyle(0xffffff, 0.35);
    g.fillCircle(-13, -13, 12);

    // キャラ画像
    const img = this.add.image(0, 0, candidate.image);
    img.setDisplaySize(R * 1.8, R * 1.8);

    const label = this.add.text(0, R + 20, candidate.name, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 },
    }).setOrigin(0.5);

    return this.add.container(x, y, [g, img, label]);
  }

  _setupClickHandler() {
    this.inputHandler.onClick((pointer) => {
      if (!this.isPlaying) return;
      for (const char of this.characters) {
        if (char.selected) continue;
        const dx = pointer.x - char.container.x;
        const dy = pointer.y - char.container.y;
        if (Math.sqrt(dx * dx + dy * dy) < CHAR_RADIUS) {
          this._handleCharClick(char, pointer.x, pointer.y);
          break;
        }
      }
    });
  }

  _handleCharClick(char, px, py) {
    char.selected = true;

    if (char.candidate.isValid) {
      this._flashCircle(char.container.x, char.container.y, 0x00aa00);
      this._showFloatingText('+1!', px, py, '#44ff44');
      this.selectedValidCount++;
      this._fillSlot(this.selectedValidCount - 1);
      if (this.selectedValidCount >= NEEDED) {
        this.endGame(true);
      }
    } else {
      this._flashCircle(char.container.x, char.container.y, 0xaa0000);
      this._shakeContainer(char.container);
      this._showFloatingText('OUT!', px, py, '#ff4444');
      this.time.delayedCall(400, () => this.endGame(false));
    }
  }

  _flashCircle(x, y, color) {
    const flash = this.add.graphics();
    flash.fillStyle(color, 0.5);
    flash.fillCircle(x, y, CHAR_RADIUS);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy(),
    });
  }

  _shakeContainer(container) {
    const origX = container.x;
    this.tweens.add({
      targets: container,
      x: origX + 8,
      duration: 50,
      yoyo: true,
      repeat: 5,
      ease: 'Linear',
      onComplete: () => { container.x = origX; },
    });
  }

  _showFloatingText(text, x, y, color) {
    const t = this.add.text(x, y, text, {
      fontFamily: 'sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color,
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: t,
      y: y - 90,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => t.destroy(),
    });
  }

  _fillSlot(index) {
    if (index >= this.slots.length) return;
    const slot = this.slots[index];
    slot.g.clear();
    slot.g.lineStyle(4, 0x00aa00);
    slot.g.fillStyle(0x44cc44);
    slot.g.fillCircle(slot.x, slot.y, 28);
    slot.g.strokeCircle(slot.x, slot.y, 28);
    slot.text.setText('✓').setColor('#ffffff');

    this.tweens.add({
      targets: slot.text,
      scale: { from: 0.5, to: 1 },
      duration: 200,
      ease: 'Back.easeOut',
    });
  }

  onTimeUp() {
    this.endGame(this.selectedValidCount >= NEEDED);
  }
}
