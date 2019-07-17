import "phaser";

const hackmanSprites = "hackmanSprites";

export class HackMan extends Phaser.Physics.Arcade.Sprite {
  static load(scene: Phaser.Scene) {
    scene.load.spritesheet(
      hackmanSprites,
      require("../assets/images/sprites/hackman.png"),
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    scene.load.on("complete", () => {
      scene.anims.create({
        key: "hackmanWalk",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: 0,
          end: 4,
        }),
        frameRate: 10,
        yoyo: true,
        repeat: -1,
      });

      scene.anims.create({
        key: "hackmanWalkBlink",
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: 5,
          end: 9,
        }),
        frameRate: 10,
        yoyo: true,
        repeat: 0,
      });
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
    super(scene, x, y, hackmanSprites, frame);
  }

  add(scene: Phaser.Scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
