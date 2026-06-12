// InputHandler.js - PC（マウス/キーボード）とスマホ（タッチ）を統合
// 各MGはこのクラス経由で入力を受けること

export class InputHandler {
  constructor(scene) {
    this.scene = scene;

    // コールバック群
    this.clickCallbacks = [];
    this.swipeCallbacks = { left: [], right: [], up: [], down: [] };
    this.directionCallbacks = []; // 継続的な方向入力（WASD/スワイプ保持）

    // スワイプ検知用
    this.swipeStartX = 0;
    this.swipeStartY = 0;
    this.swipeStartTime = 0;
    this.SWIPE_THRESHOLD = 30; // px
    this.SWIPE_MAX_TIME = 500; // ms

    // 継続方向入力の現在状態
    this.currentDirection = { x: 0, y: 0 };

    // キーボード（PC）
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // ポインター（クリック・タップ・スワイプ）
    this.onPointerDown = (pointer) => this._handlePointerDown(pointer);
    this.onPointerUp = (pointer) => this._handlePointerUp(pointer);
    scene.input.on('pointerdown', this.onPointerDown);
    scene.input.on('pointerup', this.onPointerUp);

    // フレームごとに方向状態を更新
    this.updateEvent = scene.events.on('update', () => this._updateDirection());
  }

  // ===== クリック/タップ =====
  onClick(callback) {
    this.clickCallbacks.push(callback);
  }

  _handlePointerDown(pointer) {
    this.swipeStartX = pointer.x;
    this.swipeStartY = pointer.y;
    this.swipeStartTime = this.scene.time.now;
  }

  _handlePointerUp(pointer) {
    const dx = pointer.x - this.swipeStartX;
    const dy = pointer.y - this.swipeStartY;
    const dt = this.scene.time.now - this.swipeStartTime;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.SWIPE_THRESHOLD || dt > this.SWIPE_MAX_TIME) {
      // クリック扱い
      this.clickCallbacks.forEach(cb => cb(pointer));
    } else {
      // スワイプ判定
      const angle = Math.atan2(dy, dx);
      const deg = (angle * 180) / Math.PI;
      let dir;
      if (deg >= -45 && deg <= 45) dir = 'right';
      else if (deg > 45 && deg < 135) dir = 'down';
      else if (deg <= -45 && deg >= -135) dir = 'up';
      else dir = 'left';
      this.swipeCallbacks[dir].forEach(cb => cb(pointer));
    }
  }

  // ===== スワイプ（単発） =====
  onSwipe(direction, callback) {
    if (this.swipeCallbacks[direction]) {
      this.swipeCallbacks[direction].push(callback);
    }
  }

  // ===== 継続方向入力（移動ゲーム用） =====
  // 戻り値：{ x: -1〜1, y: -1〜1 }
  getDirection() {
    return { ...this.currentDirection };
  }

  _updateDirection() {
    // キーボード入力
    let kx = 0, ky = 0;
    if (this.keys.left.isDown || this.keys.leftArrow.isDown) kx = -1;
    else if (this.keys.right.isDown || this.keys.rightArrow.isDown) kx = 1;
    if (this.keys.up.isDown || this.keys.upArrow.isDown) ky = -1;
    else if (this.keys.down.isDown || this.keys.downArrow.isDown) ky = 1;

    // タッチドラッグ（押しっぱなしで方向入力）
    let tx = 0, ty = 0;
    const pointer = this.scene.input.activePointer;
    if (pointer.isDown && this.scene.time.now - this.swipeStartTime > 100) {
      const dx = pointer.x - this.swipeStartX;
      const dy = pointer.y - this.swipeStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 20) {
        tx = dx / dist;
        ty = dy / dist;
      }
    }

    this.currentDirection.x = kx !== 0 ? kx : tx;
    this.currentDirection.y = ky !== 0 ? ky : ty;
  }

  // ===== 連打検知 =====
  isJustPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.space);
  }

  destroy() {
    if (this.scene && this.scene.input) {
      this.scene.input.off('pointerdown', this.onPointerDown);
      this.scene.input.off('pointerup', this.onPointerUp);
    }
    this.clickCallbacks = [];
    this.swipeCallbacks = { left: [], right: [], up: [], down: [] };
  }
}
