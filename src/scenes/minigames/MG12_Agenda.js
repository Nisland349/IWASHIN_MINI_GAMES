// MG12_Agenda.js - 朝会議題を選別せよ！
// 操作: タップ/クリック
// 成功: 重要議題を2つ以上選ぶ / 失敗: 不要議題を選ぶ or 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const NEEDED = 2;

const TOPICS = [
  { text: '不正融資の現状',   important: true  },
  { text: '法令遵守状況',     important: true  },
  { text: '内部監査報告',     important: true  },
  { text: '昨日のゴルフの話', important: false },
  { text: '飲み会の件',       important: false },
  { text: '雑談タイム',       important: false },
];

export default class MG12_Agenda extends MiniGameBase {
  constructor() {
    super({ key: 'MG12_Agenda' });
    this.gameTitle = '朝会議題を選別せよ！';
    this.gameDuration = 5;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfff9c4).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 80, '重要な議題だけ選べ！', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#333333',
    }).setOrigin(0.5);

    this.selectedCount = 0;
    super.create();
  }

  onGameStart() {
    const shuffled = Phaser.Utils.Array.Shuffle([...TOPICS]);
    const cols = 2, rows = 3;
    const W = 170, H = 100;
    const padX = (GAME_WIDTH - W * cols) / (cols + 1);
    const startY = 115;
    const gapY = 16;

    shuffled.forEach((topic, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padX + col * (W + padX);
      const y = startY + row * (H + gapY);
      this._createCard(x, y, W, H, topic);
    });
  }

  _createCard(x, y, w, h, topic) {
    const bg = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0xffffff)
      .setStrokeStyle(2, topic.important ? 0x1565c0 : 0xaaaaaa)
      .setInteractive();

    const icon = topic.important ? '📋' : '😴';
    this.add.text(x + w / 2, y + 28, icon, { fontSize: '26px' }).setOrigin(0.5);

    this.add.text(x + w / 2, y + 68, topic.text, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#333333',
      align: 'center',
      wordWrap: { width: w - 12 },
    }).setOrigin(0.5);

    let tapped = false;
    bg.on('pointerdown', () => {
      if (!this.isPlaying || tapped) return;
      tapped = true;

      if (topic.important) {
        bg.setFillStyle(0xbbdefb).setStrokeStyle(3, 0x1565c0);
        this.selectedCount++;
        if (this.selectedCount >= NEEDED) {
          this.time.delayedCall(200, () => this.endGame(true));
        }
      } else {
        bg.setFillStyle(0xffcdd2).setStrokeStyle(3, 0xc62828);
        this.cameras.main.shake(200, 0.01);
        this.time.delayedCall(300, () => this.endGame(false));
      }
    });
  }

  onTimeUp() {
    this.endGame(this.selectedCount >= NEEDED);
  }
}
