// BootScene.js - 起動・初期化

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 将来：画像・音声のプリロードはここに
  }

  create() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('test')) {
      this.scene.start('TestModeScene');
    } else {
      this.scene.start('TitleScene');
    }
  }
}
