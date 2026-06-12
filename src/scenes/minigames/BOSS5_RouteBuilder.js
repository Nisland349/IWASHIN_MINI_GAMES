// BOSS5_RouteBuilder.js - 迂回ルート構築シミュレーター
// 操作: 3本のルートを順番タップで完成
// 成功: 3ルート全完成 / 失敗: 時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const ROUTES = [
  { order: ['本社', 'A社', 'B社'], color: 0x42a5f5 },
  { order: ['A社', 'C社', 'X1社'], color: 0x66bb6a },
  { order: ['B社', 'D社', 'X2社'], color: 0xffa726 },
];

const NODES = [
  { label: '本社', x: 60,              y: 300 },
  { label: 'A社',  x: GAME_WIDTH / 2,  y: 200 },
  { label: 'B社',  x: GAME_WIDTH / 2,  y: 420 },
  { label: 'C社',  x: GAME_WIDTH - 60, y: 200 },
  { label: 'D社',  x: GAME_WIDTH - 60, y: 420 },
  { label: 'X1社', x: GAME_WIDTH - 60, y: 300 },
  { label: 'X2社', x: 60,              y: 550 },
];

export default class BOSS5_RouteBuilder extends MiniGameBase {
  constructor() {
    super({ key: 'BOSS5_RouteBuilder' });
    this.gameTitle = 'ルート構築\nシミュレーター！';
    this.gameDuration = 60;
  }

  create() {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0);

    this.currentRoute = 0;
    this.currentStep = 0;
    this.graphics = this.add.graphics().setDepth(3);
    super.create();
  }

  onGameStart() {
    this.statusText = this.add.text(GAME_WIDTH / 2, 70, '', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(20);

    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 80, '', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffee58',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.nodeObjs = [];
    NODES.forEach(node => {
      const bg = this.add.circle(node.x, node.y, 38, 0x37474f)
        .setStrokeStyle(3, 0x546e7a)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      const label = this.add.text(node.x, node.y, node.label, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#eceff1',
      }).setOrigin(0.5).setDepth(6);

      this.nodeObjs.push({ bg, label, ...node });

      bg.on('pointerdown', () => {
        if (!this.isPlaying) return;
        this._handleTap(node.label);
      });
    });

    this._updateUI();
  }

  _handleTap(label) {
    const route = ROUTES[this.currentRoute];
    const expected = route.order[this.currentStep];

    if (label === expected) {
      const nodeObj = this.nodeObjs.find(n => n.label === label);
      nodeObj.bg.setFillStyle(route.color);

      if (this.currentStep > 0) {
        const prevLabel = route.order[this.currentStep - 1];
        const prevNode = this.nodeObjs.find(n => n.label === prevLabel);
        this.graphics.lineStyle(4, route.color, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(prevNode.x, prevNode.y);
        this.graphics.lineTo(nodeObj.x, nodeObj.y);
        this.graphics.strokePath();
      }

      this.currentStep++;
      if (this.currentStep >= route.order.length) {
        this.currentRoute++;
        this.currentStep = 0;
        if (this.currentRoute >= ROUTES.length) {
          this.time.delayedCall(300, () => this.endGame(true));
          return;
        }
      }
      this._updateUI();
    } else {
      // 誤タップ → このルートのみリセット
      this.currentStep = 0;
      this.cameras.main.shake(150, 0.008);
      // ルートの色を元に戻す
      const route = ROUTES[this.currentRoute];
      route.order.forEach(l => {
        const n = this.nodeObjs.find(n => n.label === l);
        if (n) n.bg.setFillStyle(0x37474f);
      });
      this._updateUI();
    }
  }

  _updateUI() {
    const route = ROUTES[this.currentRoute];
    this.statusText.setText(`ルート ${this.currentRoute + 1}/${ROUTES.length}: ${route.order.join('→')}`);
    const next = route.order[this.currentStep];
    this.hintText.setText(`次は「${next}」！`);
  }

  onTimeUp() {
    this.endGame(false);
  }
}
