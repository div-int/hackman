import "phaser";

const hackmanSprites = "hackmanSprites";
const defaultFrame = 0;
const maxDirections = 3;
const hackmanFrameRate = 10;

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

  static MaxDirections() {
    return maxDirections;
  }

  WalkDirection() {
    get: {
      return this._walkDirection;
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
        frameRate: hackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });
      scene.anims.create({
        key: "hackmanWalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkDown,
          end: walkEnd + walkDown,
        }),
        frameRate: hackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });
      scene.anims.create({
        key: "hackmanWalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkLeft,
          end: walkEnd + walkLeft,
        }),
        frameRate: hackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });
      scene.anims.create({
        key: "hackmanWalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkStart + walkUp,
          end: walkEnd + walkUp,
        }),
        frameRate: hackmanFrameRate,
        yoyo: true,
        repeat: -1,
      });

      scene.anims.create({
        key: "hackmanWalkRightBlink",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: 5,
          end: 9,
        }),
        frameRate: hackmanFrameRate,
        yoyo: true,
        repeat: 0,
      });
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, hackmanSprites, defaultFrame);
  }

  add(scene: Phaser.Scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  walk(walkDirection: HackManWalkDirection) {
    this.face(walkDirection);
    this.setVelocity(
      hackManWalkDirectionValues[walkDirection].velocity.x,
      hackManWalkDirectionValues[walkDirection].velocity.y
    );
  }

  face(walkDirection: HackManWalkDirection) {
    this._walkDirection = walkDirection;
    // console.log(
    //   `ghost${this._ghostNo + 1}Walk${
    //     ghostWalkDirectionValues[walkDirection].direction
    //   }`
    // );
    this.anims.play(
      `hackmanWalk${hackManWalkDirectionValues[walkDirection].direction}`,
      true,
      0
    );
  }

  update() {
    let direction: HackManWalkDirection;
    const { x, y } = this.body.velocity;

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
