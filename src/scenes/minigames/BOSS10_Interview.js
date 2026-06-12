// BOSS10_Interview.js - 真相究明・ラストインタビュー
// 操作: 「真相を語る」「かわす」の2択
// 成功: 真相ゲージ100 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const GAUGE_MAX = 100;
const GAIN = 10;
const LOSS = 5;

const TESTIMONIES = [
  '融資の判断は誰が行いましたか？',
  '内部統制はなぜ機能しなかったのですか？',
  '報告書を隠蔽しようとしましたか？',
  '不正融資の全貌を把握していましたか？',
  '再発防止策を実施する意思はありますか？',
  '被害者への補償をどう考えますか？',
  '組織風土の問題をどう認識していますか？',
];

export default class BOSS10_Interview extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS10_Interview' });
    this.gameTitle = '真相究明\nラストインタビュー！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1e).setOrigin(0);

    this.gauge = 0;
    this.qIdx = 0;
    this.shuffled = Phaser.Utils.Array.Shuffle([...TESTIMONIES]);
    this.answering = false;
    super.create();
  }

  onGameStart() {
    // ゲージ
    this.add.rectangle(GAME_WIDTH / 2, 85, 320, 24, 0x1a1a3a).setDepth(20);
    this.gaugeBar = this.add.rectangle(GAME_WIDTH / 2 - 160, 85, 0, 24, 0xffd54f)
      .setOrigin(0, 0.5).setDepth(21);
    this.gaugeText = this.add.text(GAME_WIDTH / 2, 85, '真相ゲージ: 0%', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(22);

    // 質問表示エリア
    this.qBg = this.add.rectangle(GAME_WIDTH / 2, 260, GAME_WIDTH - 30, 180, 0x1a237e)
      .setStrokeStyle(2, 0x5c6bc0).setDepth(5);
    this.qText = this.add.text(GAME_WIDTH / 2, 260, '', {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      color: '#e8eaf6',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 60 },
    }).setOrigin(0.5).setDepth(6);

    // 「真相を語る」ボタン
    this.btnTrue = this.add.rectangle(GAME_WIDTH / 4, 460, 155, 90, 0x1b5e20)
      .setStrokeStyle(3, 0x69f0ae)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    this.add.text(GAME_WIDTH / 4, 460, '✅\n真相を語る', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#69f0ae',
      align: 'center',
    }).setOrigin(0.5).setDepth(11);

    // 「かわす」ボタン
    this.btnFalse = this.add.rectangle(GAME_WIDTH * 3 / 4, 460, 155, 90, 0x7f0000)
      .setStrokeStyle(3, 0xef5350)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    this.add.text(GAME_WIDTH * 3 / 4, 460, '❌\nかわす', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ef5350',
      align: 'center',
    }).setOrigin(0.5).setDepth(11);

    this.resultText = this.add.text(GAME_WIDTH / 2, 570, '', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(12);

    this.btnTrue.on('pointerdown', () => this._answer(true));
    this.btnFalse.on('pointerdown', () => this._answer(false));

    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIdx >= this.shuffled.length) {
      this.shuffled = Phaser.Utils.Array.Shuffle([...TESTIMONIES]);
      this.qIdx = 0;
    }
    this.qText.setText(this.shuffled[this.qIdx]);
    this.qIdx++;
    this.answering = false;
    this.resultText.setText('');
  }

  _answer(speak) {
    if (!this.isPlaying || this.answering) return;
    this.answering = true;

    if (speak) {
      this.gauge = Math.min(GAUGE_MAX, this.gauge + GAIN);
      this.resultText.setText(`+${GAIN} 真相解明！`).setColor('#69f0ae');
      this.cameras.main.flash(100, 0, 200, 0);
    } else {
      this.gauge = Math.max(0, this.gauge - LOSS);
      this.resultText.setText(`-${LOSS} かわした！`).setColor('#ef5350');
      this.cameras.main.shake(100, 0.006);
    }

    const ratio = this.gauge / GAUGE_MAX;
    this.gaugeBar.width = 320 * ratio;
    this.gaugeText.setText(`真相ゲージ: ${this.gauge}%`);

    if (this.gauge >= GAUGE_MAX) {
      this.time.delayedCall(300, () => this.endGame(true));
      return;
    }

    this.time.delayedCall(600, () => {
      if (this.isPlaying) this._showQuestion();
    });
  }

  onTimeUp() {
    this.endGame(false);
  }
}
