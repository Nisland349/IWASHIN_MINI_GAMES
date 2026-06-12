// BOSS7_Trial.js - 法令コンプライアンス裁判ショー
// 操作: 2択選択（正解/不正解）
// 成功: 15正解 / 失敗: 3ミス or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const GOAL = 15;
const MAX_MISS = 3;

const QUESTIONS = [
  { q: '信用組合は中小企業・個人\nを主な対象とする金融機関？', correct: true },
  { q: '理事長は第三者委員会の\n委員を兼務できる？', correct: false },
  { q: '不正融資は「理事会決議」\nがあれば合法？', correct: false },
  { q: '内部統制の目的は\n不正・誤謬の防止？', correct: true },
  { q: '銀行法は信用組合に\n直接適用される？', correct: false },
  { q: '取引の記録保存は\n信義則上の義務？', correct: true },
  { q: '監事は業務執行の\n適法性を監査する？', correct: true },
  { q: '外部監査人は経営者の\n指示に従う義務がある？', correct: false },
];

export default class BOSS7_Trial extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS7_Trial' });
    this.gameTitle = '法令コンプライアンス\n裁判ショー！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a0030).setOrigin(0);

    this.score = 0;
    this.miss = 0;
    this.qIdx = 0;
    this.shuffled = Phaser.Utils.Array.Shuffle([...QUESTIONS]);
    super.create();
  }

  onGameStart() {
    this.scoreText = this.add.text(30, 80, `正解: 0/${GOAL}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#69f0ae',
    }).setDepth(20);

    this.missText = this.add.text(GAME_WIDTH - 30, 80, `ミス: 0/${MAX_MISS}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ef5350',
    }).setOrigin(1, 0).setDepth(20);

    this.qBg = this.add.rectangle(GAME_WIDTH / 2, 260, GAME_WIDTH - 30, 160, 0x311b92)
      .setStrokeStyle(2, 0x7c4dff).setDepth(5);
    this.qText = this.add.text(GAME_WIDTH / 2, 260, '', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#e8eaf6',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 60 },
    }).setOrigin(0.5).setDepth(6);

    // 正解/不正解ボタン
    this.btnTrue = this.add.rectangle(GAME_WIDTH / 4, 460, 150, 80, 0x1b5e20)
      .setStrokeStyle(3, 0x69f0ae)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    this.add.text(GAME_WIDTH / 4, 460, '○ 正しい', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#69f0ae',
    }).setOrigin(0.5).setDepth(11);

    this.btnFalse = this.add.rectangle(GAME_WIDTH * 3 / 4, 460, 150, 80, 0x7f0000)
      .setStrokeStyle(3, 0xef5350)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    this.add.text(GAME_WIDTH * 3 / 4, 460, '✗ 誤り', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ef5350',
    }).setOrigin(0.5).setDepth(11);

    this.btnTrue.on('pointerdown', () => this._answer(true));
    this.btnFalse.on('pointerdown', () => this._answer(false));

    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIdx >= this.shuffled.length) {
      this.shuffled = Phaser.Utils.Array.Shuffle([...QUESTIONS]);
      this.qIdx = 0;
    }
    const q = this.shuffled[this.qIdx];
    this.qText.setText(q.q);
    this.currentCorrect = q.correct;
    this.qIdx++;
  }

  _answer(answer) {
    if (!this.isPlaying) return;

    if (answer === this.currentCorrect) {
      this.score++;
      this.scoreText.setText(`正解: ${this.score}/${GOAL}`);
      this.cameras.main.flash(100, 0, 200, 0);
      if (this.score >= GOAL) {
        this.endGame(true);
        return;
      }
    } else {
      this.miss++;
      this.missText.setText(`ミス: ${this.miss}/${MAX_MISS}`);
      this.cameras.main.shake(150, 0.01);
      if (this.miss >= MAX_MISS) {
        this.endGame(false);
        return;
      }
    }
    this._showQuestion();
  }

  onTimeUp() {
    this.endGame(false);
  }
}
