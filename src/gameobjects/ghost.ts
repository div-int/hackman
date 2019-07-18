import "phaser";
import { RIGHT } from "phaser";

const hackmanSprites = "hackmanSprites";
const defaultFrame = [16, 32, 48, 64];
const maxGhostNo = 3;
const ghostFrameRate = 5;

const ghost1 = 1;
const ghost2 = 2;
const ghost3 = 3;
const ghost4 = 4;

const walkRightStart = 0;
const walkRightEnd = 1;
const walkDownStart = 2;
const walkDownEnd = 3;
const walkLeftStart = 4;
const walkLeftEnd = 5;
const walkUpStart = 6;
const walkUpEnd = 7;

export enum GhostWalkDirection {
  Right = "Right",
  Down = "Down",
  Left = "Left",
  Up = "Up",
}

export class Ghost extends Phaser.Physics.Arcade.Sprite {
  private _ghostNo: number;

  static MaxGhostNo() {
    return maxGhostNo;
  }

  static load(scene: Phaser.Scene) {
    scene.load.on("complete", () => {
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
        key: "ghost4WalkRight",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkRightStart + 16 * ghost4,
          end: walkRightEnd + 16 * ghost4,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost4WalkDown",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkDownStart + 16 * ghost4,
          end: walkDownEnd + 16 * ghost4,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost4WalkLeft",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkLeftStart + 16 * ghost4,
          end: walkLeftEnd + 16 * ghost4,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost4WalkUp",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: walkUpStart + 16 * ghost4,
          end: walkUpEnd + 16 * ghost4,
        }),
        frameRate: ghostFrameRate,
        repeat: -1,
      });
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number, ghostNo: number) {
    super(scene, x, y, hackmanSprites, defaultFrame[ghostNo]);

    this._ghostNo = ghostNo;
  }

  add(scene: Phaser.Scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  walk(walkDirection: GhostWalkDirection) {
    console.log(`ghost${this._ghostNo + 1}Walk${walkDirection}`);
    this.anims.play(`ghost${this._ghostNo + 1}Walk${walkDirection}`);
  }
}
