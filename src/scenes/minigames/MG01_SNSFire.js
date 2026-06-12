// MG01_SNSFire.js - SNS火種を消せ！
// 仕様：該当投稿（2つ以上）を時間内に全削除
// 操作：クリック/タップ
// 成功：炎上投稿を全て消す / 失敗：時間切れ

import MiniGameBase from '../../common/MiniGameBase.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../main.js';

const FIRE_POSTS = [
  { text: 'また融資の不正発覚？いわしんどうなってるの', user: '告発者A', handle: '@whistle_blow1' },
  { text: 'いわしん終わりだろこれ…報告書やばい', user: '怒りの市民', handle: '@angry_iwaki' },
  { text: '内部告発キター！隠蔽体質ヤバすぎ', user: '匿名記者', handle: '@anon_press' },
  { text: '第三者委員会の調査結果がヤバすぎる件', user: '事情通', handle: '@jijou_tsu' },
  { text: '無断借名融資って何？いわしん大丈夫？', user: '不安な預金者', handle: '@fuan_yokin' },
];

const NORMAL_POSTS = [
  { text: 'いい天気ですね〜散歩日和☀️', user: 'いわき太郎', handle: '@iwaki_taro' },
  { text: '昼はラーメン食べた🍜うまかった', user: 'グルメ日記', handle: '@gourmet_note' },
  { text: '猫がかわいすぎて仕事にならない🐱', user: 'ねこ好き', handle: '@neko_daisuki' },
  { text: '読書の秋📚今日は3冊読んだ', user: '本の虫', handle: '@bookworm_jp' },
  { text: 'コーヒーがうまい季節になってきた☕', user: 'カフェ巡り', handle: '@cafe_meguri' },
];

export default class MG01_SNSFire extends MiniGameBase {
  constructor() {
    super({ key: 'MG01_SNSFire' });
    this.gameTitle = 'SNS火種を消せ！';
    this.gameDuration = 5;
  }

  create() {
    // 背景（Twitter風ライトグレー）
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xf7f9f9).setOrigin(0);

    // ヘッダー（タイマーバーの下に配置して重なりを回避）
    this.add.rectangle(0, 55, GAME_WIDTH, 40, 0xffffff).setOrigin(0);
    this.add.rectangle(0, 94, GAME_WIDTH, 1, 0xeff3f4).setOrigin(0);
    this.add.text(20, 68, '𝕏', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#0f1419',
    }).setOrigin(0, 0.5);
    this.add.text(48, 68, 'いわしんTimeline', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#0f1419',
    }).setOrigin(0, 0.5);

    this.posts = [];
    this.fireCount = 0;

    super.create();
  }

  onGameStart() {
    this.spawnPosts();
  }

  spawnPosts() {
    const fireCount = 3;
    const normalCount = 3;
    this.fireCount = fireCount;

    const allPosts = [];
    Phaser.Utils.Array.Shuffle([...FIRE_POSTS]).slice(0, fireCount).forEach(p => {
      allPosts.push({ ...p, isFire: true });
    });
    Phaser.Utils.Array.Shuffle([...NORMAL_POSTS]).slice(0, normalCount).forEach(p => {
      allPosts.push({ ...p, isFire: false });
    });
    Phaser.Utils.Array.Shuffle(allPosts);

    const startY = 100;
    const postHeight = 110;
    const gap = 5;

    allPosts.forEach((post, i) => {
      const y = startY + i * (postHeight + gap);
      this.createPost(post, 0, y, GAME_WIDTH, postHeight);
    });
  }

  createPost(post, x, y, width, height) {
    const elements = [];

    // カード背景
    const bg = this.add.rectangle(x, y, width, height, post.isFire ? 0xfff5f5 : 0xffffff)
      .setOrigin(0)
      .setInteractive();
    elements.push(bg);

    // 下線セパレーター
    const separator = this.add.rectangle(x, y + height - 1, width, 1, 0xeff3f4).setOrigin(0);
    elements.push(separator);

    // アバター
    const avatarX = x + 30;
    const avatarY = y + 30;
    const avatar = this.add.circle(avatarX, avatarY, 18, post.isFire ? 0xffcccc : 0xcce4ff);
    elements.push(avatar);
    const avatarEmoji = this.add.text(avatarX, avatarY, post.isFire ? '😡' : '🙂', {
      fontSize: '16px',
    }).setOrigin(0.5);
    elements.push(avatarEmoji);

    // ユーザー名
    const nameText = this.add.text(x + 56, y + 12, post.user, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#0f1419',
    });
    elements.push(nameText);

    // ハンドル名
    const handleText = this.add.text(x + 56 + nameText.width + 6, y + 13, post.handle, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#536471',
    });
    elements.push(handleText);

    // ツイート本文
    const tweetText = this.add.text(x + 56, y + 34, post.text, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#0f1419',
      wordWrap: { width: width - 80 },
      lineSpacing: 3,
    });
    elements.push(tweetText);

    // アクションバー（リプライ・リポスト・いいね）
    const actionY = y + height - 24;
    const rnd = () => Phaser.Math.Between(1, 50);
    const actions = [`💬 ${rnd()}`, `🔁 ${rnd()}`, `❤️ ${rnd()}`];
    actions.forEach((action, i) => {
      const actionText = this.add.text(x + 56 + i * 90, actionY, action, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#536471',
      });
      elements.push(actionText);
    });

    // 炎上マーク
    if (post.isFire) {
      const fireIcon = this.add.text(x + width - 35, y + 10, '🔥', {
        fontSize: '20px',
      });
      elements.push(fireIcon);

      // 左ボーダー（赤アクセント）
      const leftBorder = this.add.rectangle(x, y, 3, height, 0xff4444).setOrigin(0);
      elements.push(leftBorder);
    }

    const postRef = { bg, elements, isFire: post.isFire, removed: false };
    this.posts.push(postRef);

    bg.on('pointerdown', () => {
      if (!this.isPlaying || postRef.removed) return;
      this.handlePostClick(postRef);
    });
  }

  handlePostClick(post) {
    post.removed = true;
    // 全要素をまとめてフェードアウト（炎マーク含む）
    this.tweens.add({
      targets: post.elements,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        post.elements.forEach(el => el.destroy());
      },
    });

    if (post.isFire) {
      this.fireCount--;
      if (this.fireCount === 0) {
        this.endGame(true);
      }
    }
  }

  onTimeUp() {
    this.endGame(false);
  }
}
