// ResultScene.js - SUCCESS/FAILED表示（チャプター対応版）

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { GameManager } from '../GameManager.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data) {
    this.success = data.success;
    this.prevMGKey = data.mgKey;
    this.chapter = data.chapter || GameManager.currentChapter || 1;
    this.isBoss = this.prevMGKey && this.prevMGKey.startsWith('BOSS');
  }

  create() {
    const bgColor = this.success ? 0x006633 : 0x880022;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, bgColor).setOrigin(0);

    const text = this.success ? 'SUCCESS!' : 'FAILED...';
    const resultText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, text, {
      fontFamily: 'sans-serif',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    resultText.setScale(0);
    this.tweens.add({
      targets: resultText,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut',
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20,
      `${GameManager.successCount}勝 ${GameManager.failCount}敗`, {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: '#ffffff',
      }
    ).setOrigin(0.5);

    if (GameManager.testMode) {
      this._handleTestModeResult();
    } else if (this.isBoss) {
      this._handleBossResult();
    } else {
      this._handleMGResult();
    }
  }

  _handleTestModeResult() {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, '[ テストモード ]', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#ffdd00',
    }).setOrigin(0.5);

    const label = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 140, 'タップしてMG選択に戻る', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({ targets: label, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    const go = () => this.scene.start('TestModeScene', { chapter: this.chapter });
    const timer = this.time.delayedCall(2500, go);
    this.input.once('pointerdown', () => { timer.remove(); go(); });
  }

  _handleBossResult() {
    if (this.success) {
      // ボス勝利 → ChapterClearScene
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, '編クリア！', {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        color: '#ffee88',
      }).setOrigin(0.5);

      this.time.delayedCall(2000, () => {
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('ChapterClearScene', { chapter: this.chapter });
        });
        this.cameras.main.fadeOut(400, 0, 0, 0);
      });
    } else {
      // ボス失敗 → リトライボタン
      const retryLabel = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 'タップしてリトライ', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0.5);

      this.tweens.add({
        targets: retryLabel,
        alpha: 0.4,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      const bossKey = GameManager.getCurrentChapterBoss();
      this.input.once('pointerdown', () => this.scene.start(bossKey));
    }
  }

  _handleMGResult() {
    const nextMG = GameManager.pickNextMGInChapter();
    if (nextMG) {
      // まだ未プレイMGがある
      const go = () => this.scene.start(nextMG.key);
      const timer = this.time.delayedCall(1500, go);
      this.input.once('pointerdown', () => { timer.remove(); go(); });
    } else {
      // 全MG完了 → ボスへ
      const bossKey = GameManager.getCurrentChapterBoss();
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, 'BOSS に挑戦！', {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ff6644',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      let triggered = false;
      const go = () => {
        if (triggered) return;
        triggered = true;
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(bossKey);
        });
        this.cameras.main.fadeOut(400, 0, 0, 0);
      };
      const timer = this.time.delayedCall(2500, go);
      this.input.once('pointerdown', () => { timer.remove(); go(); });
    }
  }
}
