import 'phaser';

const hackmanSpritesPNG = require('../assets/images/sprites/hackman.png');
const hackmanSprites = 'hackmanSprites';

export default class HackMan extends Phaser.Physics.Arcade.Sprite {
  static load(scene: Phaser.Scene) {
    scene.load.spritesheet(hackmanSprites, hackmanSpritesPNG, {
      frameWidth: 16,
      frameHeight: 16
    });
    scene.load.on('complete', () => {
      scene.anims.create({
        key: 'hackmanWalk',
        frames: scene.anims.generateFrameNumbers(hackmanSprites, {
          start: 0,
          end: 4
        }),
        frameRate: 10,
        yoyo: true,
        repeat: -1
      });
    });
  }

  constructor(scene: Phaser.Scene, x, y, frame) {
    super(scene, x, y, hackmanSprites, frame);
  }

  add(scene: Phaser.Scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
