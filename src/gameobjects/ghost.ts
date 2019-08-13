import 'phaser';
import { Sprite } from './sprite';
import { Typed } from '@div-int/typedfsm';

const maxGhostNo = 4;
const maxDirections = 3;

const ghost0 = 5;
const ghost1 = 6;
const ghost2 = 7;
const ghost3 = 8;
const ghost4 = 12;
const ghostFrightened = 9;
const ghostEaten = 10;

const defaultFrame = [ghost0 * 16, ghost1 * 16, ghost2 * 16, ghost3 * 16, ghost4 * 16];

const walkRightStart = 0;
const walkRightEnd = 1;
const walkDownStart = 2;
const walkDownEnd = 3;
const walkLeftStart = 4;
const walkLeftEnd = 5;
const walkUpStart = 6;
const walkUpEnd = 7;

export enum GhostWalkDirection {
  Right,
  Down,
  Left,
  Up,
}

export enum GhostState {
  Paused,
  Waiting,
  Chase,
  Scatter,
  Frightened,
  Eaten,
}

export enum GhostAction {
  Wait,
  Chase,
  Scatter,
  Frighten,
  Eat,
  Pause,
}

//const ghostState = new Typed.FSM<GhostState, GhostAction>(GhostState.Chase);

const ghostWalkDirectionValues = [
  { direction: 'Right', velocity: { x: Consts.Game.GhostSpeed, y: 0 } },
  { direction: 'Down', velocity: { x: 0, y: Consts.Game.GhostSpeed } },
  { direction: 'Left', velocity: { x: -Consts.Game.GhostSpeed, y: 0 } },
  { direction: 'Up', velocity: { x: 0, y: -Consts.Game.GhostSpeed } },
];

export class Ghost extends Sprite {
  private _ghostNo: number;
  private _mapLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private _walkDirection: GhostWalkDirection;
  private _faceDirection: GhostWalkDirection;
  private _hitWall: boolean;
  private _speedMultiplier: number;
  private _animationPrefix: string;
  private _ghostState: GhostState;
  private _target: Phaser.GameObjects.Sprite;
  private _targetX: number;
  private _targetY: number;
  private _walkDelay = 0;
  // private _shadowSprite: Phaser.Physics.Arcade.Sprite;
  // private _previousX: number;
  // private _previousY: number;
  // private _previousState: GhostState;

  static MaxGhostNo() {
    return maxGhostNo;
  }

  static MaxDirections() {
    return maxDirections;
  }

  get GhostNo() {
    return this._ghostNo;
  }

  set GhostNo(ghostNo: number) {
    this._ghostNo = ghostNo;
  }

  get WalkDirection() {
    return this._walkDirection;
  }

  set WalkDirection(walkDirection: GhostWalkDirection) {
    this._walkDirection = walkDirection % (Ghost.MaxDirections() + 1);

    if (walkDirection < 0) this._walkDirection += Ghost.MaxDirections() + 1;
  }

  get FaceDirection() {
    return this._faceDirection;
  }

  set FaceDirection(faceDirection: GhostWalkDirection) {
    this._faceDirection = faceDirection % (Ghost.MaxDirections() + 1);

    if (faceDirection < 0) this._faceDirection += Ghost.MaxDirections() + 1;
  }

  get SpeedMultiplier() {
    return this._speedMultiplier;
  }

  set SpeedMultiplier(speedMultiplier: number) {
    Math.abs(speedMultiplier) <= 2 ? (this._speedMultiplier = Math.abs(speedMultiplier)) : 2;
  }

  get GhostState() {
    return this._ghostState;
  }

  set GhostState(ghostState: GhostState) {
    if (ghostState === this._ghostState) return;

    if (ghostState === GhostState.Paused) {
      this.body.stop();
      this.anims.pause();
      this._ghostState = ghostState;
      return;
    }

    if (ghostState === GhostState.Frightened) {
      if (this._ghostState === GhostState.Eaten) return;
      this.setAlpha(Consts.MagicNumbers.ThreeQuarters);
      this.SpeedMultiplier = Consts.MagicNumbers.Half;
      this._animationPrefix = 'ghostFrightened';
      this._ghostState = ghostState;
      this.updateAnimation();
      this.walk(this.WalkDirection + 2);
      return;
    }

    if (ghostState === GhostState.Eaten) {
      this.setAlpha(Consts.MagicNumbers.One);
      this.SpeedMultiplier = 2;
      this._animationPrefix = 'ghostEaten';
      this._ghostState = ghostState;
      this.updateAnimation();
      this.walk(this.WalkDirection + 2);
      return;
    }

    this.setAlpha(Consts.MagicNumbers.One);
    this.SpeedMultiplier = 1;
    this._animationPrefix = `ghost${this.GhostNo}`;
    this._ghostState = ghostState;
    this.updateAnimation();
  }

  public get target() {
    return this._target;
  }

  public set target(value: Phaser.GameObjects.Sprite) {
    this._target = value;
  }

  public get targetX() {
    if (this._target) return this._target.x;
    else return 0;
  }

  public get targetY() {
    if (this._target) return this._target.y;
    else return 0;
  }

  static load(scene: Phaser.Scene) {
    scene.load.on('complete', () => {
      scene.anims.create({
        key: 'ghost0WalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghost0,
          end: walkRightEnd + 16 * ghost0,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost0WalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghost0,
          end: walkDownEnd + 16 * ghost0,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost0WalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghost0,
          end: walkLeftEnd + 16 * ghost0,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost0WalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghost0,
          end: walkUpEnd + 16 * ghost0,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: 'ghost1WalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghost1,
          end: walkRightEnd + 16 * ghost1,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost1WalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghost1,
          end: walkDownEnd + 16 * ghost1,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost1WalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghost1,
          end: walkLeftEnd + 16 * ghost1,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost1WalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghost1,
          end: walkUpEnd + 16 * ghost1,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: 'ghost2WalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghost2,
          end: walkRightEnd + 16 * ghost2,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost2WalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghost2,
          end: walkDownEnd + 16 * ghost2,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost2WalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghost2,
          end: walkLeftEnd + 16 * ghost2,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost2WalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghost2,
          end: walkUpEnd + 16 * ghost2,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: 'ghost3WalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghost3,
          end: walkRightEnd + 16 * ghost3,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost3WalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghost3,
          end: walkDownEnd + 16 * ghost3,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost3WalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghost3,
          end: walkLeftEnd + 16 * ghost3,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost3WalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghost3,
          end: walkUpEnd + 16 * ghost3,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: 'ghost4WalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghost4,
          end: walkRightEnd + 16 * ghost4,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost4WalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghost4,
          end: walkDownEnd + 16 * ghost4,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost4WalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghost4,
          end: walkLeftEnd + 16 * ghost4,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghost4WalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghost4,
          end: walkUpEnd + 16 * ghost4,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: 'ghostFrightenedWalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghostFrightened,
          end: walkRightEnd + 16 * ghostFrightened,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghostFrightenedWalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghostFrightened,
          end: walkDownEnd + 16 * ghostFrightened,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghostFrightenedWalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghostFrightened,
          end: walkLeftEnd + 16 * ghostFrightened,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghostFrightenedWalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghostFrightened,
          end: walkUpEnd + 16 * ghostFrightened,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: 'ghostEatenWalkRight',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkRightStart + 16 * ghostEaten,
          end: walkRightEnd + 16 * ghostEaten,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghostEatenWalkDown',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkDownStart + 16 * ghostEaten,
          end: walkDownEnd + 16 * ghostEaten,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghostEatenWalkLeft',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkLeftStart + 16 * ghostEaten,
          end: walkLeftEnd + 16 * ghostEaten,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: 'ghostEatenWalkUp',
        frames: scene.anims.generateFrameNumbers(Consts.Resources.HackManSprites, {
          start: walkUpStart + 16 * ghostEaten,
          end: walkUpEnd + 16 * ghostEaten,
        }),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
    });
  }

  constructor(
    scene: Phaser.Scene,
    mapLayer: Phaser.Tilemaps.StaticTilemapLayer,
    x: number,
    y: number,
    ghostNo: number,
    walkDirection: number,
    ghostState?: GhostState
  ) {
    super(
      scene,
      x,
      y,
      Consts.Resources.HackManSprites,
      defaultFrame[ghostNo],
      true,
      Sprite.ColliderType.LeftRightUpDown
    );

    this._mapLayer = mapLayer;
    // this._shadowSprite = new Phaser.Physics.Arcade.Sprite(
    //   scene,
    //   x,
    //   y,
    //   Consts.Resources.HackManSprites,
    //   defaultFrame[ghostNo]
    // )
    //   .setDepth(4)
    //   .setTint(0)
    //   .setAlpha(Consts.MagicNumbers.Quarter);

    scene.physics.add.overlap(this.colliderGroup, mapLayer, this.colliderCallback);

    this._ghostNo = ghostNo;
    this._walkDirection = walkDirection;
    this._faceDirection = walkDirection;

    this.GhostNo = ghostNo;
    this.WalkDirection = walkDirection;
    this.FaceDirection = walkDirection;

    if (ghostState === undefined) this.GhostState = GhostState.Scatter;
    else this.GhostState = ghostState;
  }

  add(scene: Phaser.Scene): Ghost {
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // scene.add.existing(this._shadowSprite);

    return this;
  }

  destroy() {
    // console.log('Ghost.destroy()');
    super.destroy();
  }

  updateAnimation(): Ghost {
    this.anims.play(`${this._animationPrefix}Walk${ghostWalkDirectionValues[this.FaceDirection].direction}`, true, 0);

    return this;
  }

  hitWall(tile: Phaser.GameObjects.GameObject) {
    this._hitWall = true;
    return;
  }

  walk(walkDirection: GhostWalkDirection): Ghost {
    if (!this.active) return;
    if (--this._walkDelay > 0) return;
    if (this.WalkDirection === walkDirection) return;

    this.WalkDirection = walkDirection;
    // if (
    //   this.WalkDirection === GhostWalkDirection.Up ||
    //   this.WalkDirection === GhostWalkDirection.Down
    // ) {
    //   this.x =
    //     (this.displayWidth >> 1) +
    //     Math.floor(this.x / this.displayWidth) * this.displayWidth;
    // }

    // if (
    //   this.WalkDirection === GhostWalkDirection.Left ||
    //   this.WalkDirection === GhostWalkDirection.Right
    // ) {
    //   this.y =
    //     (this.displayHeight >> 1) +
    //     Math.floor(this.y / this.displayHeight) * this.displayHeight;
    // }

    this._walkDelay = 8;

    this.setVelocity(
      ghostWalkDirectionValues[this.WalkDirection].velocity.x * this.scaleX * this.SpeedMultiplier,
      ghostWalkDirectionValues[this.WalkDirection].velocity.y * this.scaleY * this.SpeedMultiplier
    );
    this.face(walkDirection);

    return this;
  }

  face(faceDirection: GhostWalkDirection): Ghost {
    if (!this.active) return;
    if (this.FaceDirection === faceDirection) return;

    this.FaceDirection = faceDirection;
    this.updateAnimation();

    return this;
  }

  update() {
    super.update();
    this.setDepth(this.x + this.y * window.innerWidth);

    if (this.GhostState === GhostState.Paused) return;

    let tile = this._mapLayer.getTileAtWorldXY(this.x, this.y, true);

    if (this._hitWall) {
      this.setDebugBodyColor(Consts.Colours.Red);
      this._hitWall = false;
      if (this.targetX < this.x && this.canMoveLeft) {
        this.walk(GhostWalkDirection.Left);
        return;
      }
      if (this.targetX > this.x && this.canMoveRight) {
        this.walk(GhostWalkDirection.Right);
        return;
      }
      if (this.targetY < this.y && this.canMoveUp) {
        this.walk(GhostWalkDirection.Up);
        return;
      }
      if (this.targetY > this.y && this.canMoveDown) {
        this.walk(GhostWalkDirection.Down);
        return;
      }
    }
    this.setDebugBodyColor(Consts.Colours.White);

    if (this.WalkDirection === GhostWalkDirection.Up || this.WalkDirection === GhostWalkDirection.Down) {
      this.x = ((tile.width >> 1) + tile.x * tile.width) * this._mapLayer.scaleX;

      if (this.targetX < this.x && this.canMoveLeft) {
        this.walk(GhostWalkDirection.Left);
        return;
      }
      if (this.targetX > this.x && this.canMoveRight) {
        this.walk(GhostWalkDirection.Right);
        return;
      }
    }
    if (this.WalkDirection === GhostWalkDirection.Left || this.WalkDirection === GhostWalkDirection.Right) {
      this.y = ((tile.height >> 1) + tile.y * tile.height) * this._mapLayer.scaleY;

      if (this.targetY < this.y && this.canMoveUp) {
        this.walk(GhostWalkDirection.Up);
        return;
      }
      if (this.targetY > this.y && this.canMoveDown) {
        this.walk(GhostWalkDirection.Down);
        return;
      }
    }
    this.setDebugBodyColor(Consts.Colours.Green);
    // console.log(this.targetX, this.targetY);
  }
}
