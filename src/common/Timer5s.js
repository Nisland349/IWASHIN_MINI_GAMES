// Timer5s.js - ゲームタイマー（5秒デフォルト）

import { GAME_WIDTH } from '../main.js';

export class Timer5s {
  constructor(scene, duration, onTimeUp) {
    this.scene = scene;
    this.duration = duration;
    this.remaining = duration;
    this.onTimeUp = onTimeUp;
    this.isRunning = false;

    // UI作成（画面上部）
    const barWidth = GAME_WIDTH - 40;
    const barHeight = 12;
    const barX = 20;
    const barY = 20;

    // 背景バー
    this.bgBar = scene.add.rectangle(barX, barY, barWidth, barHeight, 0x333333)
      .setOrigin(0, 0)
      .setDepth(900);

    // 進捗バー
    this.fillBar = scene.add.rectangle(barX, barY, barWidth, barHeight, 0x00ff88)
      .setOrigin(0, 0)
      .setDepth(901);

    // 残り秒数テキスト
    this.timeText = scene.add.text(GAME_WIDTH / 2, barY + barHeight + 4, `${duration.toFixed(1)}`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5, 0).setDepth(902);
  }

  start() {
    this.isRunning = true;
    this.remaining = this.duration;
    this.tickEvent = this.scene.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => this.tick(),
    });
  }

  tick() {
    if (!this.isRunning) return;
    this.remaining -= 0.05;
    if (this.remaining <= 0) {
      this.remaining = 0;
      this.updateUI();
      this.stop();
      if (this.onTimeUp) this.onTimeUp();
      return;
    }
    this.updateUI();
  }

  updateUI() {
    const ratio = this.remaining / this.duration;
    this.fillBar.scaleX = ratio;
    // 残り1秒で赤に
    if (this.remaining < 1) {
      this.fillBar.fillColor = 0xff3355;
    } else if (this.remaining < 2) {
      this.fillBar.fillColor = 0xffaa00;
    }
    this.timeText.setText(this.remaining.toFixed(1));
  }

  stop() {
    this.isRunning = false;
    if (this.tickEvent) {
      this.tickEvent.remove();
      this.tickEvent = null;
    }
  }

  destroy() {
    this.stop();
    if (this.bgBar) this.bgBar.destroy();
    if (this.fillBar) this.fillBar.destroy();
    if (this.timeText) this.timeText.destroy();
  }
}
