import "phaser";
import { RIGHT } from "phaser";

const hackmanSprites = "hackmanSprites";
const maxGhostNo = 3;
const maxDirections = 3;
const ghostFrameRate = 5;

const ghost0 = 5;
const ghost1 = 6;
const ghost2 = 7;
const ghost3 = 8;
const ghostFrightened = 9;
const ghostEaten = 10;

const defaultFrame = [ghost0 * 16, ghost1 * 16, ghost2 * 16, ghost3 * 16];

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
  Chase,
  Scatter,
  Frightened,
  Eaten,
}

const ghostWalkDirectionValues = [
  { direction: "Right", velocity: { x: 75, y: 0 } },
  { direction: "Down", velocity: { x: 0, y: 75 } },
  { direction: "Left", velocity: { x: -75, y: 0 } },
  { direction: "Up", velocity: { x: 0, y: -75 } },
];

export class Ghost extends Phaser.Physics.Arcade.Sprite {
  private _ghostNo: number;
  private _walkDirection: GhostWalkDirection;
  private _faceDirection: GhostWalkDirection;
  private _speedMultiplier: number;
  private _animationPrefix: string;
  private _ghostState: GhostState;
  private _shadowSprite: Phaser.Physics.Arcade.Sprite;

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
    Math.abs(speedMultiplier) <= 2
      ? (this._speedMultiplier = Math.abs(speedMultiplier))
      : 2;
  }

  get GhostState() {
    return this._ghostState;
  }

  set GhostState(ghostState: GhostState) {
    if (ghostState === this._ghostState) return;

    if (ghostState === GhostState.Frightened) {
      if (this._ghostState === GhostState.Eaten) return;
      this.setAlpha(Consts.MagicNumbers.ThreeQuarters);
      this.SpeedMultiplier = Consts.MagicNumbers.Half;
      this._animationPrefix = "ghostFrightened";
      this._ghostState = ghostState;
      this.updateAnimation();
      this.walk(this.WalkDirection + 2);
      return;
    }
    if (ghostState === GhostState.Eaten) {
      this.setAlpha(Consts.MagicNumbers.One);
      this.SpeedMultiplier = 2;
      this._animationPrefix = "ghostEaten";
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

  static load(scene: Phaser.Scene) {
    scene.load.on("complete", () => {
      scene.anims.create({
        key: "ghost0WalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghost0,
          end: walkRightEnd + 16 * ghost0,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost0WalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghost0,
          end: walkDownEnd + 16 * ghost0,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost0WalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghost0,
          end: walkLeftEnd + 16 * ghost0,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost0WalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghost0,
          end: walkUpEnd + 16 * ghost0,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghost1WalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghost1,
          end: walkRightEnd + 16 * ghost1,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost1WalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghost1,
          end: walkDownEnd + 16 * ghost1,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost1WalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghost1,
          end: walkLeftEnd + 16 * ghost1,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost1WalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghost1,
          end: walkUpEnd + 16 * ghost1,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghost2WalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghost2,
          end: walkRightEnd + 16 * ghost2,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost2WalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghost2,
          end: walkDownEnd + 16 * ghost2,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost2WalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghost2,
          end: walkLeftEnd + 16 * ghost2,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost2WalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghost2,
          end: walkUpEnd + 16 * ghost2,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghost3WalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghost3,
          end: walkRightEnd + 16 * ghost3,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost3WalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghost3,
          end: walkDownEnd + 16 * ghost3,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost3WalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghost3,
          end: walkLeftEnd + 16 * ghost3,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost3WalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghost3,
          end: walkUpEnd + 16 * ghost3,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghostFrightenedWalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghostFrightened,
          end: walkRightEnd + 16 * ghostFrightened,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostFrightenedWalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghostFrightened,
          end: walkDownEnd + 16 * ghostFrightened,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostFrightenedWalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghostFrightened,
          end: walkLeftEnd + 16 * ghostFrightened,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostFrightenedWalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghostFrightened,
          end: walkUpEnd + 16 * ghostFrightened,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghostEatenWalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghostEaten,
          end: walkRightEnd + 16 * ghostEaten,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostEatenWalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghostEaten,
          end: walkDownEnd + 16 * ghostEaten,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostEatenWalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghostEaten,
          end: walkLeftEnd + 16 * ghostEaten,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostEatenWalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghostEaten,
          end: walkUpEnd + 16 * ghostEaten,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
    });
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    ghostNo: number,
    walkDirection: number,
    ghostState?: GhostState
  ) {
    super(scene, x, y, hackmanSprites, defaultFrame[ghostNo]);

    this._shadowSprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      x,
      y,
      hackmanSprites,
      defaultFrame[ghostNo]
    )
      .setDepth(4)
      .setTint(0)
      .setAlpha(Consts.MagicNumbers.Quarter);

    this._ghostNo = ghostNo;
    this._walkDirection = walkDirection;
    this._faceDirection = walkDirection;

    this.GhostNo = ghostNo;
    this.WalkDirection = walkDirection;
    this.FaceDirection = walkDirection;

    if (ghostState === undefined) this.GhostState = GhostState.Scatter;
    else this.GhostState = ghostState;
  }

  add(scene: Phaser.Scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.add.existing(this._shadowSprite);
  }

  updateAnimation() {
    this.anims.play(
      `${this._animationPrefix}Walk${
        ghostWalkDirectionValues[this.FaceDirection].direction
      }`,
      true,
      0
    );
  }

  walk(walkDirection: GhostWalkDirection) {
    if (!this.active) return;
    if (this.WalkDirection === walkDirection) return;

    this.WalkDirection = walkDirection;

    this.setVelocity(
      ghostWalkDirectionValues[this.WalkDirection].velocity.x *
        this.scaleX *
        this.SpeedMultiplier,
      ghostWalkDirectionValues[this.WalkDirection].velocity.y *
        this.scaleY *
        this.SpeedMultiplier
    );
    this.face(walkDirection);
  }

  face(faceDirection: GhostWalkDirection) {
    if (!this.active) return;
    if (this.FaceDirection === faceDirection) return;

    this.FaceDirection = faceDirection;
    this.updateAnimation();
  }

  kill() {
    if (!this.active) return;
    this.anims.stop();
    this._shadowSprite.setActive(false);
    this._shadowSprite.destroy();
    this.setActive(false);
  }

  update() {
    if (!this.active) return;
    this.setDepth(this.x + this.y * window.innerWidth);
    let direction: GhostWalkDirection;
    const { x, y } = this.body.velocity;

    this._shadowSprite.scale = this.scale;
    this._shadowSprite.x = this.x + Consts.Game.ShadowOffset;
    this._shadowSprite.y = this.y + Consts.Game.ShadowOffset;
    this._shadowSprite.frame = this.frame;

    if (Math.abs(x) > Math.abs(y)) {
      if (x <= 0) {
        direction = GhostWalkDirection.Left;
      } else {
        direction = GhostWalkDirection.Right;
      }
    } else {
      if (y <= 0) {
        direction = GhostWalkDirection.Up;
      } else {
        direction = GhostWalkDirection.Down;
      }
    }

    this.face(direction);
  }
}
