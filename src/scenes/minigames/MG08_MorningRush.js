// MG08_MorningRush.js - 朝会に遅れるな！
// 操作: クリック/タップ連打
// 成功: ゲージ100%到達 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const GOAL = 100;
const PER_CLICK = 7;

export default class MG08_MorningRush extends MiniGameBase {
  constructor() {
    super({ key: 'MG08_MorningRush' });
    this.gameTitle = '朝会に遅れるな！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff8e1).setOrigin(0);

    // 時計ヘッダー
    this.add.rectangle(0, 0, GAME_WIDTH, 60, 0x1565c0).setOrigin(0);
    this.add.text(GAME_WIDTH / 2, 30, '🕒 8:44 → 8:45に間に合え！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 85, '連打でダッシュ！', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#333333',
      stroke: '#ffffff',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.progress = 0;
    super.create();
  }

  onGameStart() {
    this._drawTrack();
    this._createRunner();
    this._createProgressBar();
    this._setupClickHandler();
  }

  _drawTrack() {
    const trackY = GAME_HEIGHT / 2 + 30;
    const g = this.add.graphics();

    // 廊下
    g.fillStyle(0xd7ccc8);
    g.fillRect(20, trackY - 30, GAME_WIDTH - 40, 80);
    g.lineStyle(3, 0x795548);
    g.strokeRect(20, trackY - 30, GAME_WIDTH - 40, 80);

    // ゴール（会議室）
    g.fillStyle(0x1565c0, 0.3);
    g.fillRect(GAME_WIDTH - 90, trackY - 30, 70, 80);
    g.lineStyle(2, 0x1565c0);
    g.strokeRect(GAME_WIDTH - 90, trackY - 30, 70, 80);

    this.add.text(GAME_WIDTH - 55, trackY + 10, '会議\n室', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#1565c0',
      align: 'center',
    }).setOrigin(0.5);

    this.trackY = trackY;
  }

  _createRunner() {
    this.runner = this.add.text(30, this.trackY + 10, '🏃', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(5);
  }

  _createProgressBar() {
    const barY = GAME_HEIGHT - 120;
    const barW = GAME_WIDTH - 60;

    this.add.text(GAME_WIDTH / 2, barY - 22, 'ダッシュゲージ', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#555555',
    }).setOrigin(0.5);

    this.add.rectangle(30, barY, barW, 28, 0xcccccc).setOrigin(0);
    this.progressBar = this.add.rectangle(30, barY, 1, 28, 0xff6600).setOrigin(0);

    this.add.text(GAME_WIDTH - 30, barY + 14, '🏁', {
      fontSize: '22px',
    }).setOrigin(1, 0.5);

    this.clickCountText = this.add.text(GAME_WIDTH / 2, barY + 48, 'タップ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ff6600',
    }).setOrigin(0.5);
  }

  _setupClickHandler() {
    this.inputHandler.onClick(() => {
      if (!this.isPlaying) return;
      this.progress = Math.min(GOAL, this.progress + PER_CLICK);
      this._updateVisuals();
      if (this.progress >= GOAL) {
        this.endGame(true);
      }
    });
  }

  _updateVisuals() {
    const ratio = this.progress / GOAL;
    const barW = GAME_WIDTH - 60;
    this.progressBar.width = Math.max(1, barW * ratio);

    const runX = 30 + (GAME_WIDTH - 120) * ratio;
    this.runner.setX(runX);

    if (this.progress >= GOAL) {
      this.clickCountText.setText('到着！！');
    } else if (this.progress > 60) {
      this.clickCountText.setText('もうちょっと！');
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
