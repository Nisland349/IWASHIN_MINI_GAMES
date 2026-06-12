// BOSS8_Tower.js - 組織改革タワーバトル
// 操作: クリックでブロックを固定してスタック
// 成功: 10ブロック積む / 失敗: 安定度0 or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const BLOCK_W = 180;
const BLOCK_H = 50;
const STACK_TOLERANCE = 12; // px以内ならOK
const MAX_STABILITY = 5;
const TOTAL_BLOCKS = 10;

export default class BOSS8_Tower extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS8_Tower' });
    this.gameTitle = '組織改革\nタワーバトル！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    this.stability = MAX_STABILITY;
    this.stacked = 0;
    this.blocks = [];
    this.movingX = GAME_WIDTH / 2;
    this.moveDir = 1;
    this.moveSpeed = 150;
    this.placedBlocks = [];
    super.create();
  }

  onGameStart() {
    // スコア表示
    this.stackText = this.add.text(GAME_WIDTH / 2, 75, `0 / ${TOTAL_BLOCKS}ブロック`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffee58',
    }).setOrigin(0.5).setDepth(20);

    // 安定度表示
    this.stabilityText = this.add.text(GAME_WIDTH - 20, 110, `安定度: ♥♥♥♥♥`, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ef5350',
    }).setOrigin(1, 0).setDepth(20);

    // 底台
    this.lastX = GAME_WIDTH / 2;
    this.lastY = GAME_HEIGHT - 80;
    const base = this.add.rectangle(GAME_WIDTH / 2, this.lastY, BLOCK_W + 40, BLOCK_H, 0x546e7a)
      .setStrokeStyle(3, 0x78909c).setDepth(5);
    this.add.text(GAME_WIDTH / 2, this.lastY, '基盤', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#eceff1',
    }).setOrigin(0.5).setDepth(6);

    // 動くブロック
    this._spawnMovingBlock();

    // クリックで固定
    this.inputHandler.onClick(() => {
      if (!this.isPlaying) return;
      this._placeBlock();
    });
  }

  _spawnMovingBlock() {
    if (this.movingBlock) {
      this.movingBlock.bg.destroy();
      this.movingBlock.label.destroy();
    }

    const y = this.lastY - BLOCK_H - 10;
    const bg = this.add.rectangle(this.movingX, y, BLOCK_W, BLOCK_H, 0x42a5f5)
      .setStrokeStyle(3, 0x1565c0).setDepth(10);
    const label = this.add.text(this.movingX, y, '改革ブロック', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(11);

    this.movingBlock = { bg, label, y };
    this.lastY = y;
  }

  _placeBlock() {
    if (!this.movingBlock) return;

    const offset = Math.abs(this.movingX - this.lastX);
    const blockX = this.movingX;
    const blockY = this.movingBlock.y;

    // 固定ブロック化
    this.movingBlock.bg.setFillStyle(0x1565c0).setStrokeStyle(3, 0x0d47a1);
    this.movingBlock.bg.setX(blockX);
    this.movingBlock.label.setX(blockX);
    this.movingBlock = null;

    this.stacked++;
    this.stackText.setText(`${this.stacked} / ${TOTAL_BLOCKS}ブロック`);

    if (offset > STACK_TOLERANCE) {
      this.stability = Math.max(0, this.stability - 1);
      this._updateStability();
      this.cameras.main.shake(120, 0.008);
      if (this.stability <= 0) {
        this.endGame(false);
        return;
      }
    }

    this.lastX = blockX;

    if (this.stacked >= TOTAL_BLOCKS) {
      this.endGame(true);
      return;
    }

    this.moveSpeed = Math.min(300, 150 + this.stacked * 15);
    this._spawnMovingBlock();
  }

  _updateStability() {
    const hearts = '♥'.repeat(this.stability) + '♡'.repeat(MAX_STABILITY - this.stability);
    this.stabilityText.setText(`安定度: ${hearts}`);
  }

  update(time, delta) {
    if (!this.isPlaying || !this.movingBlock) return;
    const dt = delta / 1000;

    this.movingX += this.moveDir * this.moveSpeed * dt;

    if (this.movingX > GAME_WIDTH - 30) {
      this.movingX = GAME_WIDTH - 30;
      this.moveDir = -1;
    } else if (this.movingX < 30) {
      this.movingX = 30;
      this.moveDir = 1;
    }

    this.movingBlock.bg.setX(this.movingX);
    this.movingBlock.label.setX(this.movingX);
  }

  onTimeUp() {
    this.endGame(false);
  }
}
