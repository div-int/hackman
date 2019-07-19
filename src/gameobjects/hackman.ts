import "phaser";

const hackmanSprites = "hackmanSprites";
const defaultFrame = 0;
const maxDirections = 3;

const walkRight = 0;
const walkDown = 16;
const walkLeft = 32;
const walkUp = 48;

const walkStart = 0;
const walkEnd = 4;

export enum HackManWalkDirection {
  Right,
  Down,
  Left,
  Up,
}

const hackManWalkDirectionValues = [
  { direction: "Right", velocity: { x: 100, y: 0 } },
  { direction: "Down", velocity: { x: 0, y: 100 } },
  { direction: "Left", velocity: { x: -100, y: 0 } },
  { direction: "Up", velocity: { x: 0, y: -100 } },
];
export class HackMan extends Phaser.Physics.Arcade.Sprite {
  private _walkDirection: HackManWalkDirection;
  private _faceDirection: HackManWalkDirection;
  private _shadowSprite: Phaser.Physics.Arcade.Sprite;

  static MaxDirections() {
    return maxDirections;
  }

  WalkDirection() {
    get: {
      return this._walkDirection;
    }
  }

  FaceDirection() {
    get: {
      return this._faceDirection;
    }
  }

  static load(scene: Phaser.Scene) {
    scene.load.on("complete", () => {
      scene.anims.create({
        key: "hackmanWalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkRight,
          end: walkEnd + walkRight,
        }),
        frameRate: Consts.Game.HackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });
      scene.anims.create({
        key: "hackmanWalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkDown,
          end: walkEnd + walkDown,
        }),
        frameRate: Consts.Game.HackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });
      scene.anims.create({
        key: "hackmanWalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkLeft,
          end: walkEnd + walkLeft,
        }),
        frameRate: Consts.Game.HackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });
      scene.anims.create({
        key: "hackmanWalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkUp,
          end: walkEnd + walkUp,
        }),
        frameRate: Consts.Game.HackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });

      scene.anims.create({
        key: "hackmanWalkRightBlink",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: 5,
          end: 9,
        }),
        frameRate: Consts.Game.HackmanFrameRate,
        yoyo: true,
        repeat: 0,
      });
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, hackmanSprites, defaultFrame);

    this._shadowSprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      x,
      y,
      hackmanSprites,
      defaultFrame
    )
      .setDepth(4)
      .setTint(0)
      .setAlpha(Consts.MagicNumbers.Quarter);
  }

  add(scene: Phaser.Scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.add.existing(this._shadowSprite);
  }

  walk(walkDirection: HackManWalkDirection) {
    if (walkDirection > HackMan.MaxDirections()) {
      walkDirection = walkDirection - (HackMan.MaxDirections() + 1);
    }
    if (walkDirection < 0) {
      walkDirection = walkDirection + (HackMan.MaxDirections() + 1);
    }

    this._walkDirection = walkDirection;
    this.face(walkDirection);
    this.setVelocity(
      hackManWalkDirectionValues[walkDirection].velocity.x * this.scaleX,
      hackManWalkDirectionValues[walkDirection].velocity.y * this.scaleY
    );
  }

  face(faceDirection: HackManWalkDirection) {
    if (faceDirection > HackMan.MaxDirections() || faceDirection < 0) {
      faceDirection = faceDirection % (HackMan.MaxDirections() + 1);
    }
    this._faceDirection = faceDirection;
    this.anims.play(
      `hackmanWalk${hackManWalkDirectionValues[faceDirection].direction}`,
      true,
      0
    );
  }

  update() {
    const { x, y } = this.body.velocity;

    this._shadowSprite.scale = this.scale;
    this._shadowSprite.x = this.x + Consts.Game.ShadowOffset;
    this._shadowSprite.y = this.y + Consts.Game.ShadowOffset;
    this._shadowSprite.frame = this.frame;

    let direction: HackManWalkDirection;

    if (Math.abs(x) > Math.abs(y)) {
      if (x <= 0) {
        direction = HackManWalkDirection.Left;
      } else {
        direction = HackManWalkDirection.Right;
      }
    } else {
      if (y <= 0) {
        direction = HackManWalkDirection.Up;
      } else {
        direction = HackManWalkDirection.Down;
      }
    }

    if (direction != this._walkDirection) {
      this.face(direction);
    }
  }
}
