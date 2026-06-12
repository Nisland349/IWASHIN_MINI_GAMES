// ChapterIntroScene.js - 章イントロ画面

import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { GameManager } from '../GameManager.js';

export default class ChapterIntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterIntroScene' });
    this.chapterNum = 1;
  }

  init(data) {
    this.chapterNum = data.chapter || 1;
  }

  create() {
    const chapters = GameManager.getChapterData();
    const chapter = chapters.find(c => c.num === this.chapterNum) || chapters[0];

    // テーマカラー背景
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, chapter.color).setOrigin(0);

    // 暗いオーバーレイ
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45).setOrigin(0);

    // 上下の白ライン
    this.add.rectangle(0, 100, GAME_WIDTH, 2, 0xffffff, 0.8).setOrigin(0);
    this.add.rectangle(0, GAME_HEIGHT - 100, GAME_WIDTH, 2, 0xffffff, 0.8).setOrigin(0);

    // "第 X 編"（大きく）
    this.add.text(GAME_WIDTH / 2, 300, `第  ${this.chapterNum}  編`, {
      fontFamily: 'serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff',
      letterSpacing: 12,
    }).setOrigin(0.5);

    // 章タイトル
    this.add.text(GAME_WIDTH / 2, 380, chapter.title, {
      fontFamily: 'serif',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 60 },
    }).setOrigin(0.5);

    // サブタイトル
    this.add.text(GAME_WIDTH / 2, 440, chapter.subtitle, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#dddddd',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 80 },
    }).setOrigin(0.5);

    // ミニゲーム本数表示
    const mgCount = GameManager.getMGCountForChapter(this.chapterNum);
    this.add.text(GAME_WIDTH / 2, 510, `ミニゲーム ${mgCount} 本 ＋ ボスあり`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#ffdd88',
    }).setOrigin(0.5);

    // 自動遷移タイマー（2.2秒後）
    const timer = this.time.delayedCall(2200, () => this._startChapter());

    // タップでスキップ
    this.input.once('pointerdown', () => {
      timer.remove();
      this._startChapter();
    });
  }

  _startChapter() {
    GameManager.startChapter(this.chapterNum);
    const first = GameManager.pickNextMGInChapter();
    if (first) {
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(first.key);
      });
      this.cameras.main.fadeOut(300, 0, 0, 0);
    } else {
      // MGが存在しない場合はボスへ
      const bossKey = GameManager.getCurrentChapterBoss();
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(bossKey);
      });
      this.cameras.main.fadeOut(300, 0, 0, 0);
    }
  }
}
