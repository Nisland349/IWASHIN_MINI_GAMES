// MG11_Governance.js - ガバナンスを整えろ！
// 操作: ドラッグ（パズル）
// 成功: 3つの組織を正しい位置に配置 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const SLOT_R = 52;
const TILE_W = 110;
const TILE_H = 55;

const SLOTS = [
  { key: '理事会',  x: GAME_WIDTH / 2,       y: 270 },
  { key: '監事会',  x: GAME_WIDTH * 0.27,     y: 460 },
  { key: '常務会',  x: GAME_WIDTH * 0.73,     y: 460 },
];

export default class MG11_Governance extends MiniGameBase {
  constructor() {
    super({ key: 'MG11_Governance' });
    this.gameTitle = 'ガバナンスを整えろ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x263238).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '正しい位置に組織を配置せよ！', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.placed = 0;
    this.tiles = [];
    super.create();
  }

  onGameStart() {
    this._drawOrgChart();
    this._spawnTiles();
    this._setupDrag();
  }

  _drawOrgChart() {
    const g = this.add.graphics();

    // スロット枠
    SLOTS.forEach(slot => {
      g.lineStyle(3, 0x90a4ae, 0.6);
      g.strokeRoundedRect(slot.x - TILE_W / 2, slot.y - TILE_H / 2, TILE_W, TILE_H, 8);
      g.fillStyle(0x455a64, 0.3);
      g.fillRoundedRect(slot.x - TILE_W / 2, slot.y - TILE_H / 2, TILE_W, TILE_H, 8);
    });

    // 組織図の線
    g.lineStyle(2, 0x90a4ae, 0.5);
    // 理事会 → 監事会
    g.lineBetween(SLOTS[0].x, SLOTS[0].y + TILE_H / 2, SLOTS[1].x, SLOTS[1].y - TILE_H / 2);
    // 理事会 → 常務会
    g.lineBetween(SLOTS[0].x, SLOTS[0].y + TILE_H / 2, SLOTS[2].x, SLOTS[2].y - TILE_H / 2);
  }

  _spawnTiles() {
    const shuffled = Phaser.Utils.Array.Shuffle([...SLOTS]);
    const startY = GAME_HEIGHT - 120;
    const startPositions = [
      { x: 80,             y: startY },
      { x: GAME_WIDTH / 2, y: startY },
      { x: GAME_WIDTH - 80, y: startY },
    ];

    shuffled.forEach((slotData, i) => {
      const { x, y } = startPositions[i];
      const bg = this.add.rectangle(x, y, TILE_W, TILE_H, 0x1976d2)
        .setStrokeStyle(3, 0xffffff)
        .setInteractive()
        .setDepth(10);

      const label = this.add.text(x, y, slotData.key, {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(11);

      this.input.setDraggable(bg);
      this.tiles.push({ bg, label, targetKey: slotData.key, startX: x, startY: y, placed: false });
    });
  }

  _setupDrag() {
    this.input.on('drag', (pointer, go, x, y) => {
      if (!this.isPlaying) return;
      go.setPosition(x, y);
      const tile = this.tiles.find(t => t.bg === go);
      if (tile) tile.label.setPosition(x, y);
    });

    this.input.on('dragend', (pointer, go) => {
      if (!this.isPlaying) return;
      const tile = this.tiles.find(t => t.bg === go);
      if (!tile || tile.placed) return;

      // 正しいスロットに近いか確認
      const target = SLOTS.find(s => s.key === tile.targetKey);
      const dx = go.x - target.x;
      const dy = go.y - target.y;
      if (Math.sqrt(dx * dx + dy * dy) < SLOT_R) {
        // 正解スナップ
        tile.placed = true;
        this.tweens.add({
          targets: [go, tile.label],
          x: target.x,
          y: target.y,
          duration: 150,
          ease: 'Back.easeOut',
          onUpdate: () => tile.label.setPosition(go.x, go.y),
          onComplete: () => {
            go.setFillStyle(0x43a047).setStrokeStyle(3, 0x00e676);
          },
        });
        this.placed++;
        if (this.placed >= 3) {
          this.time.delayedCall(400, () => this.endGame(true));
        }
      } else {
        // 元に戻す
        this.tweens.add({
          targets: [go, tile.label],
          x: tile.startX,
          y: tile.startY,
          duration: 200,
          ease: 'Back.easeOut',
          onUpdate: () => tile.label.setPosition(go.x, go.y),
        });
      }
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
