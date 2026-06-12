// MiniGameBase.js - 全ミニゲームの基底クラス
// 全てのMGはこのクラスを継承すること

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { Timer5s } from './Timer5s.js';
import { InputHandler } from './InputHandler.js';
import { GameManager } from '../GameManager.js';

export default class MiniGameBase extends Phaser.Scene {
  constructor(config) {
    super(config);
    // ゲーム時間（秒）。サブクラスでオーバーライド可
    this.gameDuration = 5;
    // ゲームタイトル（サブクラスで設定）
    this.gameTitle = '';
    // 状態
    this.isPlaying = false;
    this.hasEnded = false;
  }

  // サブクラスは super.create() を必ず呼ぶこと
  create() {
    this.isPlaying = false;
    this.hasEnded = false;

    // 入力ハンドラー初期化
    this.inputHandler = new InputHandler(this);

    // タイマー初期化
    this.timer = new Timer5s(this, this.gameDuration, () => this.onTimeUp());

    // タイトル表示
    this.showTitle();
  }

  // タイトル演出（1秒）→ ゲーム開始
  showTitle() {
    const titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.gameTitle, {
      fontFamily: 'sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 40 },
    }).setOrigin(0.5).setDepth(1000);

    this.tweens.add({
      targets: titleText,
      scale: { from: 0.5, to: 1.2 },
      duration: 300,
      yoyo: true,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(1000, () => {
      titleText.destroy();
      this.startGame();
    });
  }

  // ゲーム本編開始
  startGame() {
    this.isPlaying = true;
    this.timer.start();
    if (typeof this.onGameStart === 'function') {
      this.onGameStart();
    }
  }

  // ゲーム終了（成功/失敗）
  endGame(success) {
    if (this.hasEnded) return;
    this.hasEnded = true;
    this.isPlaying = false;
    this.timer.stop();

    GameManager.recordResult(this.scene.key, success);

    // 0.5秒後にResultSceneへ
    this.time.delayedCall(500, () => {
      this.scene.start('ResultScene', { success, mgKey: this.scene.key, chapter: GameManager.currentChapter });
    });
  }

  // タイムアップ時の処理（必ずオーバーライドすること）
  onTimeUp() {
    console.warn(`${this.scene.key}: onTimeUp() がオーバーライドされていません`);
    this.endGame(false);
  }

  // クリーンアップ
  shutdown() {
    if (this.inputHandler) this.inputHandler.destroy();
    if (this.timer) this.timer.destroy();
  }
}
