const hackmanSpritesPNG = require('../assets/images/sprites/hackman.png');
const hackmanSprites = 'hackmanSprites';

export default class HackMan {
  private static _spritesheet: any;
  private _scene: Phaser.Scene;
  private _sprite: Phaser.Physics.Arcade.Sprite;
  private static _animations = false;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;

    /** Load hackman sprite sheet (16 x 16) frame, (512 x 512) sheet
     * Row 0 : Eating / Moving animation
     */

    if (!HackMan._spritesheet) {
      HackMan._spritesheet = this._scene.load.spritesheet(
        hackmanSprites,
        hackmanSpritesPNG,
        {
          frameWidth: 16,
          frameHeight: 16
        }
      );
    }

    if (!HackMan._animations) {
      this._scene.load.on('complete', () => {
        this._scene.anims.create({
          key: 'hackmanWalk',
          frames: this._scene.anims.generateFrameNumbers(hackmanSprites, {
            start: 0,
            end: 4
          }),
          frameRate: 10,
          yoyo: true,
          repeat: -1
        });
      });
    }

    HackMan._animations = true;
  }

  scene() {
    get: {
      return this._scene;
    }
  }

  sprite() {
    get: {
      return this._sprite;
    }
  }

  create(x?: number, y?: number, frame?: number): Phaser.Physics.Arcade.Sprite {
    if (!this._sprite) {
      this._sprite = this._scene.physics.add.sprite(
        x,
        y,
        hackmanSprites,
        frame
      );
    } else {
      this._sprite.setPosition(x, y);
      this._sprite.setFrame(frame);
    }

    return this._sprite;
  }

  destroy() {}
}
