// BOSS6_CultureBreakdown.js - 組織風土ブレイクダウン
// 操作: 複合（クリック、ドラッグ、連打）
// 成功: 風通しゲージ100 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const GAUGE_MAX = 100;
const ACTIONS = [
  { type: 'window', label: '窓を開ける', desc: '窓をクリック！', count: 3 },
  { type: 'sign', label: '看板を捨てる', desc: '看板をクリック！', count: 3 },
  { type: 'wall', label: '壁を壊す', desc: '壁を連打！', hp: 10 },
];

export default class BOSS6_CultureBreakdown extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS6_CultureBreakdown' });
    this.gameTitle = '組織風土\nブレイクダウン！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1b2838).setOrigin(0);

    this.gauge = 0;
    this.actionIdx = 0;
    this.actionProgress = 0;
    super.create();
  }

  onGameStart() {
    // ゲージ表示
    this.gaugeBarBg = this.add.rectangle(GAME_WIDTH / 2, 90, 320, 28, 0x37474f).setDepth(20);
    this.gaugeBar = this.add.rectangle(GAME_WIDTH / 2 - 160, 90, 0, 28, 0x66bb6a)
      .setOrigin(0, 0.5).setDepth(21);
    this.gaugeText = this.add.text(GAME_WIDTH / 2, 90, '風通し: 0%', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(22);

    this.actionLabel = this.add.text(GAME_WIDTH / 2, 130, '', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffee58',
    }).setOrigin(0.5).setDepth(20);

    this.descLabel = this.add.text(GAME_WIDTH / 2, 165, '', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#b2ebf2',
    }).setOrigin(0.5).setDepth(20);

    this.actionObjs = [];
    this._startNextAction();
  }

  _clearActionObjs() {
    this.actionObjs.forEach(o => {
      if (o && o.destroy) o.destroy();
    });
    this.actionObjs = [];
  }

  _startNextAction() {
    if (this.actionIdx >= ACTIONS.length) {
      // 全アクション完了でループ
      this.actionIdx = 0;
    }
    const action = ACTIONS[this.actionIdx];
    this.actionProgress = 0;
    this._clearActionObjs();
    this.actionLabel.setText(action.label);
    this.descLabel.setText(action.desc);

    if (action.type === 'window') {
      this._setupWindowAction(action);
    } else if (action.type === 'sign') {
      this._setupSignAction(action);
    } else if (action.type === 'wall') {
      this._setupWallAction(action);
    }
  }

  _setupWindowAction(action) {
    for (let i = 0; i < action.count; i++) {
      const x = 80 + i * 110;
      const y = GAME_HEIGHT / 2;
      const btn = this.add.rectangle(x, y, 90, 90, 0x455a64)
        .setStrokeStyle(3, 0x546e7a)
        .setInteractive({ useHandCursor: true })
        .setDepth(10);
      const icon = this.add.text(x, y, '🪟', { fontSize: '40px' }).setOrigin(0.5).setDepth(11);
      this.actionObjs.push(btn, icon);

      btn.on('pointerdown', () => {
        if (!this.isPlaying || btn.done) return;
        btn.done = true;
        btn.disableInteractive();
        btn.setFillStyle(0x80deea);
        icon.setText('🌬️');
        this.actionProgress++;
        if (this.actionProgress >= action.count) {
          this._addGauge(20);
        }
      });
    }
  }

  _setupSignAction(action) {
    const labels = ['上意下達', '隠蔽体質', '独断専行'];
    for (let i = 0; i < action.count; i++) {
      const x = 80 + i * 110;
      const y = GAME_HEIGHT / 2;
      const btn = this.add.rectangle(x, y, 90, 70, 0xd84315)
        .setStrokeStyle(3, 0xbf360c)
        .setInteractive({ useHandCursor: true })
        .setDepth(10);
      const lbl = this.add.text(x, y, labels[i], {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
      }).setOrigin(0.5).setDepth(11);
      this.actionObjs.push(btn, lbl);

      btn.on('pointerdown', () => {
        if (!this.isPlaying || btn.done) return;
        btn.done = true;
        btn.disableInteractive();
        this.tweens.add({
          targets: [btn, lbl],
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 200,
        });
        this.actionProgress++;
        if (this.actionProgress >= action.count) {
          this._addGauge(20);
        }
      });
    }
  }

  _setupWallAction(action) {
    this.wallHp = action.hp;
    const wall = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 260, 150, 0x616161)
      .setStrokeStyle(4, 0x9e9e9e)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    const wallLbl = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '沈黙の壁', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#eeeeee',
    }).setOrigin(0.5).setDepth(11);
    this.actionObjs.push(wall, wallLbl);

    this.inputHandler.onClick(() => {
      if (!this.isPlaying || this.wallHp <= 0) return;
      if (!wall.active) return;
      this.wallHp--;
      this.cameras.main.shake(50, 0.005);
      if (this.wallHp <= 0) {
        wall.disableInteractive();
        wallLbl.setText('破壊！');
        this._addGauge(20);
      }
    });
  }

  _addGauge(amount) {
    this.gauge = Math.min(GAUGE_MAX, this.gauge + amount);
    const ratio = this.gauge / GAUGE_MAX;
    this.gaugeBar.width = 320 * ratio;
    this.gaugeText.setText(`風通し: ${this.gauge}%`);

    if (this.gauge >= GAUGE_MAX) {
      this.time.delayedCall(300, () => this.endGame(true));
      return;
    }

    this.actionIdx++;
    this.time.delayedCall(500, () => {
      if (this.isPlaying) this._startNextAction();
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
